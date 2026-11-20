import Link from "next/link";
import { encomendas } from "@/_data/encomendas";
import {
  filtrarEncomendasPorCpf,
  hasCpfListagemFilters,
  parseEncomendaSearchParams,
  type SearchParamsRecord,
} from "@/lib/encomenda-search";
import { BoxIcon, TruckIcon, CheckCircleIcon } from "@/components/icons";
import { ArrowLeft } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { EncomendaListClient } from "./encomenda-list-client";

export const instant = false;

interface RastreamentoPageProps {
  searchParams: Promise<SearchParamsRecord>;
}

export default async function RastreamentoPage({ searchParams }: RastreamentoPageProps) {
  const resolvedParams = await searchParams;
  const filters = parseEncomendaSearchParams(resolvedParams);
  const temFiltroAtivo = hasCpfListagemFilters(filters);

  const encomendasFiltradas = temFiltroAtivo
    ? filtrarEncomendasPorCpf(encomendas, filters)
    : encomendas;

  const { cpf: paramCpf, cpfRemetente: paramCpfRemetente, cpfDestinatario: paramCpfDestinatario } =
    filters;

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
            <div className="win95-sunken bg-[#FFFFD0] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border border-[#808080]">
              <div className="flex items-center gap-2 text-black flex-wrap">
                <span className="font-bold text-[#000080]">Filtro ativo:</span>
                <span className="font-mono bg-white px-2 py-0.5 win95-sunken">
                  {paramCpf && `cpf="${paramCpf}" `}
                  {paramCpfRemetente && `remetente="${paramCpfRemetente}" `}
                  {paramCpfDestinatario && `destinatario="${paramCpfDestinatario}" `}
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
                Detalhe por rota{" "}
                <span className="font-mono text-[11px]">/ssw/100/BR…</span> ou{" "}
                <span className="font-mono text-[11px]">/ssw/100/nf…</span>. Listagem por CPF:{" "}
                <span className="font-mono text-[11px]">?destinatario=</span> ou{" "}
                <span className="font-mono text-[11px]">?remetente=</span>.
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

          {/* Componente Client com Busca Local (NF, Código, CPF) e Lista Interativa */}
          <EncomendaListClient
            initialEncomendas={encomendasFiltradas}
            allCount={total}
            emTransitoCount={emTransito}
            entreguesCount={entregues}
          />

        </div>
      </main>
    </div>
  );
}
