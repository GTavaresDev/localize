import Link from "next/link";
import { coletasCadastradas } from "@/_data/coletas";
import { normalizarTexto, bateDocumento } from "@/lib/search-utils";
import { PackagePlus, ArrowLeft } from "lucide-react";
import { ColetaListClient } from "./coleta-list-client";

export const instant = false;

interface ColetaPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function getParam(param: string | string[] | undefined): string | undefined {
  if (Array.isArray(param)) return param[0];
  return param;
}

export default async function ColetaPage({ searchParams }: ColetaPageProps) {
  const resolvedParams = await searchParams;

  const q = getParam(resolvedParams.q);
  const paramCodigo = getParam(resolvedParams.codigo);
  const paramCpf = getParam(resolvedParams.cpf);
  const paramCpfRemetente = getParam(resolvedParams.cpf_remetente);
  const paramCpfDestinatario = getParam(resolvedParams.cpf_destinatario);

  const temFiltroQueryParam = Boolean(
    q || paramCodigo || paramCpf || paramCpfRemetente || paramCpfDestinatario
  );

  const coletasFiltradasServidor = coletasCadastradas.filter((item) => {
    // 1. Query param: codigo (código da coleta, agendamento ou encomenda)
    if (paramCodigo) {
      const buscado = normalizarTexto(paramCodigo);
      const matchId = normalizarTexto(item.id).includes(buscado);
      const matchAg = normalizarTexto(item.codigoAgendamento).includes(buscado);
      const matchEnc = normalizarTexto(item.codigoEncomenda).includes(buscado);
      if (!matchId && !matchAg && !matchEnc) return false;
    }

    // 2. Query param: cpf (remetente ou destinatário)
    if (paramCpf) {
      const matchRem = bateDocumento(item.remetente.documento, paramCpf);
      const matchDest = bateDocumento(item.destinatario.documento, paramCpf);
      if (!matchRem && !matchDest) return false;
    }

    // 3. Query param: cpf_remetente
    if (paramCpfRemetente) {
      if (!bateDocumento(item.remetente.documento, paramCpfRemetente)) return false;
    }

    // 4. Query param: cpf_destinatario
    if (paramCpfDestinatario) {
      if (!bateDocumento(item.destinatario.documento, paramCpfDestinatario)) return false;
    }

    // 5. Query param: ?q= (código ou cpf de remetente e destinatário)
    if (q) {
      const buscado = normalizarTexto(q);
      const matchCodigo =
        normalizarTexto(item.id).includes(buscado) ||
        normalizarTexto(item.codigoAgendamento).includes(buscado) ||
        normalizarTexto(item.codigoEncomenda).includes(buscado);
      const matchRemCpf = bateDocumento(item.remetente.documento, q);
      const matchDestCpf = bateDocumento(item.destinatario.documento, q);

      if (!matchCodigo && !matchRemCpf && !matchDestCpf) {
        return false;
      }
    }

    return true;
  });

  const totalCriadas = coletasCadastradas.filter((c) => c.status === "criada").length;
  const totalRetiradas = coletasCadastradas.filter((c) => c.status === "retirada").length;

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#000080] selection:text-white">
      {/* Header Windows 95 */}
      <header className="sticky top-0 z-20 win95-raised bg-[#C0C0C0]">
        <div
          aria-hidden="true"
          className="win95-titlebar bg-[#000080] text-white px-3 py-1 flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-xs font-bold">
            <PackagePlus className="w-3.5 h-3.5" />
            <span>Módulo 101 - Gestão e Agendamento de Coletas no Destino</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="win95-btn bg-[#C0C0C0] text-black w-4 h-4 inline-flex items-center justify-center text-[10px] leading-none font-bold pointer-events-none">
              _
            </span>
            <span className="win95-btn bg-[#C0C0C0] text-black w-4 h-4 inline-flex items-center justify-center text-[10px] leading-none font-bold pointer-events-none">
              □
            </span>
            <span className="win95-btn bg-[#C0C0C0] text-black w-4 h-4 inline-flex items-center justify-center text-[10px] leading-none font-bold pointer-events-none">
              ×
            </span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="win95-btn px-2.5 py-1 text-xs font-bold flex items-center gap-1.5 hover:bg-[#D4D0C8]"
              title="Voltar para a página inicial"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Início</span>
            </Link>
            <div className="h-6 w-[2px] bg-[#808080]" />
            <div>
              <span className="text-sm font-bold tracking-tight text-black">
                Coletas Agendadas
              </span>
              <span className="text-[10px] text-[#000080] font-mono font-bold ml-2">
                [Opção 101]
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="win95-sunken bg-white px-3 py-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#000080]" />
              <span>{totalCriadas} criadas</span>
            </div>
            <div className="win95-sunken bg-white px-3 py-1 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#008000]" />
              <span>{totalRetiradas} retiradas</span>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="win95-raised p-4 sm:p-6 bg-[#C0C0C0] space-y-6">
          
          {/* Alerta de Filtro Ativo por Query Param */}
          {temFiltroQueryParam && (
            <div className="win95-sunken bg-[#FFFFD0] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border border-[#808000]">
              <div className="flex items-center gap-2 text-black">
                <span className="font-bold text-[#000080]">Filtro de busca ativo:</span>
                <span className="font-mono bg-white px-2 py-0.5 win95-sunken">
                  {q && `q="${q}" `}
                  {paramCodigo && `codigo="${paramCodigo}" `}
                  {paramCpf && `cpf="${paramCpf}" `}
                  {paramCpfRemetente && `cpf_remetente="${paramCpfRemetente}" `}
                  {paramCpfDestinatario && `cpf_destinatario="${paramCpfDestinatario}" `}
                </span>
              </div>
              <Link
                href="/ssw/101"
                className="win95-btn px-2.5 py-0.5 text-[11px] font-bold text-center self-start sm:self-auto"
              >
                Limpar Filtros
              </Link>
            </div>
          )}

          {/* Barra Informativa */}
          <div className="win95-sunken bg-white p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <PackagePlus className="w-4 h-4 text-[#000080]" />
              <p className="text-black font-medium">
                Busca de coletas por: <strong>código</strong> ou <strong>CPF do remetente e destinatário</strong>.
              </p>
            </div>
            <span className="font-mono text-[#000080] font-bold">
              OPÇÃO 101 • BUSCA VIA QUERY PARAMS ATIVADA
            </span>
          </div>

          <ColetaListClient
            initialColetas={coletasFiltradasServidor}
            allCount={coletasCadastradas.length}
            criadasCount={totalCriadas}
            retiradasCount={totalRetiradas}
          />

        </div>
      </main>
    </div>
  );
}
