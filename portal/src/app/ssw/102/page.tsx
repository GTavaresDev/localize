"use client";

import { useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cotacoesCadastradas, type CotacaoItem } from "@/_data/cotacoes";
import { normalizarTexto, bateDocumento } from "@/lib/search-utils";
import {
  Calculator,
  ArrowLeft,
  ArrowRight,
  Clock,
  User as UserIcon,
  Calendar,
  Search,
} from "lucide-react";

function CotacoesContent() {
  const searchParams = useSearchParams();

  // Query params suportados:
  // - ?q=... (busca geral por código ou cpf de remetente/destinatário)
  // - ?codigo=...
  // - ?cpf=...
  // - ?cpf_remetente=...
  // - ?cpf_destinatario=...
  const q = searchParams.get("q");
  const paramCodigo = searchParams.get("codigo");
  const paramCpf = searchParams.get("cpf");
  const paramCpfRemetente = searchParams.get("cpf_remetente");
  const paramCpfDestinatario = searchParams.get("cpf_destinatario");

  const [buscaLocal, setBuscaLocal] = useState("");

  const temFiltroQueryParam = Boolean(
    q || paramCodigo || paramCpf || paramCpfRemetente || paramCpfDestinatario
  );

  const cotacoesFiltradas = useMemo(() => {
    return cotacoesCadastradas.filter((item) => {
      // 1. Query param: codigo (id, slug ou numeroCotacao ex: COT-2026-001)
      if (paramCodigo) {
        const buscado = normalizarTexto(paramCodigo);
        const matchId = normalizarTexto(item.id) === buscado;
        const matchSlug = normalizarTexto(item.slug) === buscado;
        const matchNum = normalizarTexto(item.numeroCotacao).includes(buscado);
        if (!matchId && !matchSlug && !matchNum) return false;
      }

      // 2. Query param: cpf (remetente ou destinatário)
      if (paramCpf) {
        const matchRem = bateDocumento(item.origem.documento, paramCpf);
        const matchDest = bateDocumento(item.destino.documento, paramCpf);
        if (!matchRem && !matchDest) return false;
      }

      // 3. Query param: cpf_remetente
      if (paramCpfRemetente) {
        if (!bateDocumento(item.origem.documento, paramCpfRemetente)) return false;
      }

      // 4. Query param: cpf_destinatario
      if (paramCpfDestinatario) {
        if (!bateDocumento(item.destino.documento, paramCpfDestinatario)) return false;
      }

      // 5. Query param unificado: ?q= (código ou cpf de remetente e destinatário)
      if (q) {
        const buscado = normalizarTexto(q);
        const matchCodigo =
          normalizarTexto(item.id) === buscado ||
          normalizarTexto(item.slug) === buscado ||
          normalizarTexto(item.numeroCotacao).includes(buscado);
        const matchRemCpf = bateDocumento(item.origem.documento, q);
        const matchDestCpf = bateDocumento(item.destino.documento, q);

        if (!matchCodigo && !matchRemCpf && !matchDestCpf) {
          return false;
        }
      }

      // 6. Busca digitada localmente
      if (buscaLocal) {
        const buscado = normalizarTexto(buscaLocal);
        const matchCodigo =
          normalizarTexto(item.id) === buscado ||
          normalizarTexto(item.slug) === buscado ||
          normalizarTexto(item.numeroCotacao).includes(buscado);
        const matchRemCpf = bateDocumento(item.origem.documento, buscaLocal);
        const matchDestCpf = bateDocumento(item.destino.documento, buscaLocal);
        const matchSolicitante = normalizarTexto(item.solicitante.nome).includes(buscado);
        const matchOrigem = normalizarTexto(item.origem.cidade).includes(buscado);
        const matchDestino = normalizarTexto(item.destino.cidade).includes(buscado);

        if (
          !matchCodigo &&
          !matchRemCpf &&
          !matchDestCpf &&
          !matchSolicitante &&
          !matchOrigem &&
          !matchDestino
        ) {
          return false;
        }
      }

      return true;
    });
  }, [paramCodigo, paramCpf, paramCpfRemetente, paramCpfDestinatario, q, buscaLocal]);

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#000080] selection:text-white">
      {/* Header Windows 95 */}
      <header className="sticky top-0 z-20 win95-raised bg-[#C0C0C0]">
        <div
          aria-hidden="true"
          className="win95-titlebar bg-[#000080] text-white px-3 py-1 flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-xs font-bold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Módulo 102 - Listagem de Cotações de Frete</span>
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
                Cotações de Frete
              </span>
              <span className="text-[10px] text-[#000080] font-mono font-bold ml-2">
                [Opção 102]
              </span>
            </div>
          </div>

          <div className="text-xs font-mono win95-sunken bg-white px-3 py-1 font-bold">
            {cotacoesFiltradas.length} cotações encontradas
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
                <span className="font-bold text-[#000080]">Filtro de cotação ativo:</span>
                <span className="font-mono bg-white px-2 py-0.5 win95-sunken">
                  {q && `q="${q}" `}
                  {paramCodigo && `codigo="${paramCodigo}" `}
                  {paramCpf && `cpf="${paramCpf}" `}
                  {paramCpfRemetente && `cpf_remetente="${paramCpfRemetente}" `}
                  {paramCpfDestinatario && `cpf_destinatario="${paramCpfDestinatario}" `}
                </span>
              </div>
              <Link
                href="/ssw/102"
                className="win95-btn px-2.5 py-0.5 text-[11px] font-bold text-center self-start sm:self-auto"
              >
                Limpar Filtros
              </Link>
            </div>
          )}

          {/* Barra Informativa */}
          <div className="win95-sunken bg-white p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#000080]" />
              <p className="text-black font-medium">
                Busca de cotação por: <strong>código</strong> ou <strong>CPF do remetente e destinatário</strong>.
              </p>
            </div>
            <span className="font-mono text-[#000080] font-bold">
              OPÇÃO 102 • BUSCA VIA QUERY PARAMS ATIVADA
            </span>
          </div>

          {/* Campo de Busca Local */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold font-mono uppercase text-black">
              Filtrar listagem de cotações:
            </span>
            <div className="w-full sm:w-80 relative">
              <input
                type="text"
                value={buscaLocal}
                onChange={(e) => setBuscaLocal(e.target.value)}
                placeholder="Código ou CPF do remetente/destinatário..."
                className="w-full h-8 px-3 pr-8 win95-sunken bg-white text-xs outline-none focus:border-[#000080]"
              />
              <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-[#808080]" />
            </div>
          </div>

          {/* Listagem de Cotações com resumo */}
          <div className="space-y-3">
            {cotacoesFiltradas.length === 0 ? (
              <div className="win95-sunken bg-white p-8 text-center space-y-2">
                <Calculator className="w-8 h-8 text-[#808080] mx-auto opacity-50" />
                <p className="text-xs text-black font-bold">
                  Nenhuma cotação encontrada para os parâmetros informados.
                </p>
                <div className="pt-2">
                  <Link href="/ssw/102" className="win95-btn px-3 py-1 text-xs font-bold inline-block">
                    Ver todas as cotações
                  </Link>
                </div>
              </div>
            ) : (
              cotacoesFiltradas.map((cotacao) => (
                <Link
                  key={cotacao.id}
                  href={`/ssw/102/${cotacao.slug}`}
                  className="block win95-raised p-4 bg-[#C0C0C0] hover:bg-[#D4D0C8] active:translate-y-px transition-colors group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Bloco 1: Número, Data e Solicitante */}
                    <div className="space-y-1.5 md:min-w-[220px]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#000080] group-hover:underline">
                          {cotacao.numeroCotacao}
                        </span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 win95-sunken bg-white text-[#404040]">
                          #{cotacao.id}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[#404040]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Data: <strong className="text-black font-mono">{cotacao.dataCriacao}</strong></span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[#404040]">
                        <UserIcon className="w-3.5 h-3.5 text-[#000080]" />
                        <span>Solicitante: <strong className="text-black">{cotacao.solicitante.nome}</strong></span>
                      </div>
                    </div>

                    {/* Bloco 2: Origem e Destino com CPF/CNPJ */}
                    <div className="flex-1 win95-sunken bg-white p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#404040] font-bold block mb-0.5">
                          Origem (Remetente)
                        </span>
                        <p className="font-bold text-black text-sm">
                          {cotacao.origem.cidade} / {cotacao.origem.uf}
                        </p>
                        <p className="text-[11px] text-[#404040]">
                          {cotacao.origem.contatoNome}
                        </p>
                        {cotacao.origem.documento && (
                          <p className="text-[10px] font-mono text-[#000080] font-bold">
                            Doc: {cotacao.origem.documento}
                          </p>
                        )}
                      </div>

                      <div className="sm:border-l sm:border-[#DFDFDF] sm:pl-3">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#000080] font-bold block mb-0.5">
                          Destino (Destinatário)
                        </span>
                        <p className="font-bold text-black text-sm">
                          {cotacao.destino.cidade} / {cotacao.destino.uf}
                        </p>
                        <p className="text-[11px] text-[#404040]">
                          {cotacao.destino.contatoNome}
                        </p>
                        {cotacao.destino.documento && (
                          <p className="text-[10px] font-mono text-[#000080] font-bold">
                            CPF/Doc: {cotacao.destino.documento}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bloco 3: Prazo e Valor com Botão */}
                    <div className="flex sm:flex-col justify-between sm:justify-center items-end text-right gap-2 md:min-w-[170px]">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#404040] block">
                          Prazo Estimado
                        </span>
                        <span className="text-xs font-bold text-black flex items-center justify-end gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#000080]" />
                          {cotacao.prazoEstimadoDias} dias úteis
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#404040] block">
                          Valor do Frete
                        </span>
                        <span className="text-base font-bold font-mono text-[#008000]">
                          {formatarMoeda(cotacao.composicaoFrete.valorTotal)}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1 text-xs font-bold text-[#000080] group-hover:underline">
                        <span>Ver detalhes</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CotacoesListPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white text-black p-6 flex items-center justify-center font-mono text-xs">
          Carregando cotações...
        </div>
      }
    >
      <CotacoesContent />
    </Suspense>
  );
}
