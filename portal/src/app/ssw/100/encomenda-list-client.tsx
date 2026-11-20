"use client";

import { useState } from "react";
import Link from "next/link";
import { Encomenda, StatusEncomenda } from "@/_data/encomendas";
import { bateDocumento, bateNotaFiscal, codigoNotaFiscal, normalizarTexto } from "@/lib/search-utils";
import {
  PackageIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MapPinIcon,
  ArrowUpRightIcon,
} from "@/components/icons";
import { Search } from "lucide-react";

interface EncomendaListClientProps {
  initialEncomendas: Encomenda[];
  allCount: number;
  emTransitoCount: number;
  entreguesCount: number;
}

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

export function EncomendaListClient({
  initialEncomendas,
  allCount,
  emTransitoCount,
  entreguesCount,
}: EncomendaListClientProps) {
  const [buscaLocal, setBuscaLocal] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "em_transito" | "entregue">("todos");

  const encomendasFiltradas = initialEncomendas.filter((item) => {
    // 1. Filtro local de Status
    if (filtroStatus === "em_transito") {
      if (item.statusAtual !== "Em Trânsito" && item.statusAtual !== "Saiu para Entrega") {
        return false;
      }
    } else if (filtroStatus === "entregue") {
      if (item.statusAtual !== "Entregue") {
        return false;
      }
    }

    // 2. Filtro digitado na barra de busca (Código da encomenda, NF, CPF/CNPJ, nomes ou cidades)
    if (buscaLocal) {
      const termo = normalizarTexto(buscaLocal);
      const matchCodigo = normalizarTexto(item.id).includes(termo);

      const matchNf = bateNotaFiscal(item.nf, buscaLocal);

      const matchRemCpf = bateDocumento(item.remetente.documento, buscaLocal);
      const matchDestCpf = bateDocumento(item.destinatario.documento, buscaLocal);
      const matchRemNome = normalizarTexto(item.remetente.nome).includes(termo);
      const matchDestNome = normalizarTexto(item.destinatario.nome).includes(termo);
      const matchRemCidade = normalizarTexto(item.remetente.cidade).includes(termo);
      const matchDestCidade = normalizarTexto(item.destinatario.cidade).includes(termo);

      if (
        !matchCodigo &&
        !matchNf &&
        !matchRemCpf &&
        !matchDestCpf &&
        !matchRemNome &&
        !matchDestNome &&
        !matchRemCidade &&
        !matchDestCidade
      ) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Barra de Filtros e Campo de Busca Local */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[#404040] font-bold mr-1">Filtrar:</span>
          <button
            type="button"
            onClick={() => setFiltroStatus("todos")}
            className={`win95-btn px-3 py-1 font-bold ${
              filtroStatus === "todos" ? "bg-[#000080] text-white" : ""
            }`}
          >
            Todas ({allCount})
          </button>
          <button
            type="button"
            onClick={() => setFiltroStatus("em_transito")}
            className={`win95-btn px-3 py-1 font-bold ${
              filtroStatus === "em_transito" ? "bg-[#000080] text-white" : ""
            }`}
          >
            Em Rota ({emTransitoCount})
          </button>
          <button
            type="button"
            onClick={() => setFiltroStatus("entregue")}
            className={`win95-btn px-3 py-1 font-bold ${
              filtroStatus === "entregue" ? "bg-[#000080] text-white" : ""
            }`}
          >
            Entregues ({entreguesCount})
          </button>
        </div>

        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            value={buscaLocal}
            onChange={(e) => setBuscaLocal(e.target.value)}
            placeholder="Buscar por código NF (ex: 0019283), rastreio, CPF..."
            className="w-full h-8 px-3 pr-8 win95-sunken bg-white text-xs text-black outline-none focus:border-[#000080]"
          />
          <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-[#808080]" />
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
            {encomendasFiltradas.length}{" "}
            {encomendasFiltradas.length === 1 ? "item" : "itens"}
          </span>
        </div>

        {encomendasFiltradas.length === 0 ? (
          <div className="win95-sunken bg-white p-8 text-center space-y-2">
            <PackageIcon className="w-8 h-8 text-[#808080] mx-auto opacity-50" />
            <p className="text-xs text-black font-bold">
              Nenhuma encomenda encontrada com os parâmetros fornecidos.
            </p>
            <p className="text-[11px] text-[#404040]">
              Tente buscar por outro código de rastreamento, número de NF ou CPF do remetente/destinatário.
            </p>
            {(buscaLocal || filtroStatus !== "todos") && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setBuscaLocal("");
                    setFiltroStatus("todos");
                  }}
                  className="win95-btn px-3 py-1 text-xs font-bold inline-block"
                >
                  Limpar busca local
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="win95-sunken bg-white p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {encomendasFiltradas.map((item) => {
              const statusCfg = getStatusConfig(item.statusAtual);
              return (
                <Link
                  key={item.id}
                  href={`/ssw/100/${item.id}`}
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
                          NF: <strong className="text-black">{codigoNotaFiscal(item.nf)}</strong>
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
  );
}
