"use client";

import { useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { encomendas, StatusEncomenda, Encomenda } from "@/_data/encomendas";
import { normalizarTexto, normalizarNumeros, bateDocumento } from "@/lib/search-utils";
import {
  PackageIcon,
  BoxIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MapPinIcon,
  ArrowUpRightIcon,
} from "@/components/icons";
import { ArrowLeft, Filter } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

function getStatusConfig(status: StatusEncomenda) {
  switch (status) {
    case "Saiu para Entrega":
      return {
        icon: <TruckIcon className="w-3.5 h-3.5 text-[#000080]" />,
        badge: "bg-[#E0E8FF] text-[#000080] border-[#000080]",
        dot: "bg-[#000080]",
      };
    case "Em Trânsito":
      return {
        icon: <PackageIcon className="w-3.5 h-3.5 text-[#000080]" />,
        badge: "bg-[#E8ECFF] text-[#000080] border-[#000080]",
        dot: "bg-[#000080]",
      };
    case "Entregue":
      return {
        icon: <CheckCircleIcon className="w-3.5 h-3.5 text-[#008000]" />,
        badge: "bg-[#E0FFE0] text-[#006000] border-[#008000]",
        dot: "bg-[#008000]",
      };
    case "Cancelado":
      return {
        icon: <XCircleIcon className="w-3.5 h-3.5 text-[#800000]" />,
        badge: "bg-[#FFE0E0] text-[#800000] border-[#800000]",
        dot: "bg-[#800000]",
      };
    case "Pendente":
    default:
      return {
        icon: <ClockIcon className="w-3.5 h-3.5 text-[#808000]" />,
        badge: "bg-[#FFFFD0] text-[#606000] border-[#808000]",
        dot: "bg-[#808000]",
      };
  }
}

function RastreamentoContent() {
  const searchParams = useSearchParams();

  // Query params suportados:
  // - ?q=... (busca geral)
  // - ?codigo=...
  // - ?nf=...
  // - ?cpf=...
  // - ?cpf_remetente=...
  // - ?cpf_destinatario=...
  const q = searchParams.get("q");
  const paramCodigo = searchParams.get("codigo");
  const paramNf = searchParams.get("nf");
  const paramCpf = searchParams.get("cpf");
  const paramCpfRemetente = searchParams.get("cpf_remetente");
  const paramCpfDestinatario = searchParams.get("cpf_destinatario");

  const temFiltroAtivo = Boolean(
    q || paramCodigo || paramNf || paramCpf || paramCpfRemetente || paramCpfDestinatario
  );

  const encomendasFiltradas = useMemo(() => {
    return encomendas.filter((item) => {
      // 1. Busca por parâmetro específico de Código
      if (paramCodigo) {
        const codigoBuscado = normalizarTexto(paramCodigo);
        if (!normalizarTexto(item.id).includes(codigoBuscado)) return false;
      }

      // 2. Busca por parâmetro específico de NF
      if (paramNf) {
        const nfBuscada = normalizarTexto(paramNf);
        const nfLimpa = normalizarNumeros(paramNf);
        const nfItemLimpa = normalizarNumeros(item.nf);
        const match =
          normalizarTexto(item.nf).includes(nfBuscada) ||
          (nfLimpa.length >= 2 && nfItemLimpa.includes(nfLimpa));
        if (!match) return false;
      }

      // 3. Busca por CPF geral (remetente ou destinatário)
      if (paramCpf) {
        const matchRem = bateDocumento(item.remetente.documento, paramCpf);
        const matchDest = bateDocumento(item.destinatario.documento, paramCpf);
        if (!matchRem && !matchDest) return false;
      }

      // 4. Busca por CPF específico do remetente
      if (paramCpfRemetente) {
        if (!bateDocumento(item.remetente.documento, paramCpfRemetente)) return false;
      }

      // 5. Busca por CPF específico do destinatário
      if (paramCpfDestinatario) {
        if (!bateDocumento(item.destinatario.documento, paramCpfDestinatario)) return false;
      }

      // 6. Busca unificada via ?q= (código, nf ou cpf de destinatário ou remetente)
      if (q) {
        const matchCodigo = normalizarTexto(item.id).includes(normalizarTexto(q));
        const nfLimpa = normalizarNumeros(q);
        const nfItemLimpa = normalizarNumeros(item.nf);
        const matchNf =
          normalizarTexto(item.nf).includes(normalizarTexto(q)) ||
          (nfLimpa.length >= 2 && nfItemLimpa.includes(nfLimpa));
        const matchRemCpf = bateDocumento(item.remetente.documento, q);
        const matchDestCpf = bateDocumento(item.destinatario.documento, q);

        if (!matchCodigo && !matchNf && !matchRemCpf && !matchDestCpf) {
          return false;
        }
      }

      return true;
    });
  }, [q, paramCodigo, paramNf, paramCpf, paramCpfRemetente, paramCpfDestinatario]);

  const total = encomendasFiltradas.length;
  const emTransito = encomendasFiltradas.filter(
    (e) => e.statusAtual === "Em Trânsito" || e.statusAtual === "Saiu para Entrega"
  ).length;
  const entregues = encomendasFiltradas.filter((e) => e.statusAtual === "Entregue").length;

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#000080] selection:text-white">
      {/* Header Minimalista */}
      <header className="sticky top-0 z-20 win95-raised bg-[#C0C0C0]">
        <div
          aria-hidden="true"
          className="win95-titlebar bg-[#000080] text-white px-3 py-1 flex items-center justify-between"
        >
          <div className="flex items-center gap-2 text-xs font-bold">
            <BoxIcon className="w-3.5 h-3.5" />
            <span>Módulo 100 - Rastreamento de Encomendas</span>
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

        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
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
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-black">
                  Localize
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#000080] px-1.5 py-0.5 win95-sunken bg-white font-bold">
                  [Opção 100]
                </span>
              </div>
              <p className="text-[11px] text-[#404040] leading-none mt-0.5">
                Gestão e Rastreabilidade de Encomendas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 win95-sunken bg-white text-black font-mono">
              <span className="w-2 h-2 bg-[#008000]" />
              <span>{total} remessas exibidas</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="win95-raised p-4 sm:p-6 space-y-6 bg-[#C0C0C0]">
          
          {/* Alerta de Filtro Ativo por Query Param */}
          {temFiltroAtivo && (
            <div className="win95-sunken bg-[#FFFFD0] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border border-[#808000]">
              <div className="flex items-center gap-2 text-black">
                <span className="font-bold text-[#000080]">Filtro via Query Param ativo:</span>
                <span className="font-mono bg-white px-2 py-0.5 win95-sunken">
                  {q && `q="${q}" `}
                  {paramCodigo && `codigo="${paramCodigo}" `}
                  {paramNf && `nf="${paramNf}" `}
                  {paramCpf && `cpf="${paramCpf}" `}
                  {paramCpfRemetente && `cpf_remetente="${paramCpfRemetente}" `}
                  {paramCpfDestinatario && `cpf_destinatario="${paramCpfDestinatario}" `}
                </span>
              </div>
              <Link
                href="/ssw/100"
                className="win95-btn px-2.5 py-0.5 text-[11px] font-bold text-center self-start sm:self-auto"
              >
                Limpar Filtros
              </Link>
            </div>
          )}

          {/* Hero Section & Métricas Rápidas */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b-2 border-[#808080]">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-black">
                Painel de <span className="text-[#000080]">Encomendas</span>
              </h1>
              <p className="text-sm text-[#404040] mt-1.5 max-w-lg">
                Filtre por código de rastreamento, nota fiscal (NF) ou CPF do remetente e destinatário.
              </p>
            </div>

            {/* Mini Dashboard de Status */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 win95-raised bg-[#C0C0C0] flex items-center gap-3">
                <div className="w-8 h-8 win95-sunken bg-white flex items-center justify-center text-[#000080]">
                  <TruckIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#404040] font-mono font-bold">Em Rota</p>
                  <p className="text-base font-bold text-black font-mono">{emTransito}</p>
                </div>
              </div>

              <div className="px-4 py-2.5 win95-raised bg-[#C0C0C0] flex items-center gap-3">
                <div className="w-8 h-8 win95-sunken bg-white flex items-center justify-center text-[#008000]">
                  <CheckCircleIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#404040] font-mono font-bold">Entregues</p>
                  <p className="text-base font-bold text-black font-mono">{entregues}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Cards de Encomendas */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-black flex items-center gap-2">
                <PackageIcon className="w-3.5 h-3.5 text-[#000080]" />
                Remessas Encontradas
              </span>
              <span className="text-xs text-[#404040] font-mono">
                {total} {total === 1 ? "item" : "itens"}
              </span>
            </div>

            {total === 0 ? (
              <div className="win95-sunken bg-white p-8 text-center space-y-2">
                <PackageIcon className="w-8 h-8 text-[#808080] mx-auto opacity-50" />
                <p className="text-xs text-black font-bold">
                  Nenhuma encomenda encontrada com os parâmetros fornecidos.
                </p>
                <p className="text-[11px] text-[#404040]">
                  Tente buscar por outro código de rastreamento, número de NF ou CPF do remetente/destinatário.
                </p>
                <div className="pt-2">
                  <Link href="/ssw/100" className="win95-btn px-3 py-1 text-xs font-bold inline-block">
                    Ver todas as encomendas
                  </Link>
                </div>
              </div>
            ) : (
              <div className="win95-sunken bg-white p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {encomendasFiltradas.map((item) => {
                  const statusCfg = getStatusConfig(item.statusAtual);
                  return (
                    <Link
                      key={item.id}
                      href={`/encomendas/${item.id}`}
                      className="group relative flex flex-col justify-between win95-raised bg-[#C0C0C0] p-4 hover:bg-[#D4D0C8] active:translate-y-px"
                    >
                      {/* Top: Tracking ID + Badge */}
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold tracking-wider text-[#000080] group-hover:underline">
                                {item.id}
                              </span>
                            </div>
                            <span className="font-mono text-[11px] text-[#404040] block mt-0.5">
                              {item.nf}
                            </span>
                          </div>

                          <div
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-bold border ${statusCfg.badge}`}
                          >
                            <span className={`w-1.5 h-1.5 ${statusCfg.dot}`} />
                            <span>{item.statusAtual}</span>
                          </div>
                        </div>

                        {/* Origem & Destino com CPF */}
                        <div className="space-y-2.5 p-3 win95-sunken bg-white text-xs">
                          <div className="flex items-start gap-2.5">
                            <div className="mt-0.5 text-[#404040]">
                              <div className="w-2.5 h-2.5 border-2 border-[#404040] bg-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] uppercase font-mono tracking-wider text-[#404040] font-bold block">
                                Origem (Remetente)
                              </span>
                              <p className="text-black font-bold truncate text-xs">
                                {item.remetente.nome}
                              </p>
                              {item.remetente.documento && (
                                <p className="text-[10px] font-mono text-[#000080]">
                                  Doc: {item.remetente.documento}
                                </p>
                              )}
                              <span className="text-[11px] text-[#404040]">
                                {item.remetente.cidade}, {item.remetente.uf}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 pt-2 border-t border-[#DFDFDF]">
                            <div className="mt-0.5 text-[#000080]">
                              <MapPinIcon className="w-3 h-3 text-[#000080]" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] uppercase font-mono tracking-wider text-[#404040] font-bold block">
                                Destino (Destinatário)
                              </span>
                              <p className="text-black font-bold truncate text-xs">
                                {item.destinatario.nome}
                              </p>
                              {item.destinatario.documento && (
                                <p className="text-[10px] font-mono text-[#000080]">
                                  CPF/Doc: {item.destinatario.documento}
                                </p>
                              )}
                              <span className="text-[11px] text-[#404040]">
                                {item.destinatario.cidade}, {item.destinatario.uf}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom: Datas + Link Arrow */}
                      <div className="mt-3 pt-2 border-t border-[#808080] flex items-center justify-between text-[11px] text-[#404040]">
                        <div>
                          <span>Previsão: </span>
                          <span className="text-black font-bold font-mono">
                            {item.previsaoEntrega}
                          </span>
                        </div>

                        <div className="inline-flex items-center gap-1 font-bold text-[#000080] group-hover:underline">
                          <span>Rastrear</span>
                          <ArrowUpRightIcon className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default function RastreamentoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white text-black p-6 flex items-center justify-center font-mono text-xs">
          Carregando rastreamento...
        </div>
      }
    >
      <RastreamentoContent />
    </Suspense>
  );
}
