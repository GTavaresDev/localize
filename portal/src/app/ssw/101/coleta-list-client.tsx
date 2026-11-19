"use client";

import { useState } from "react";
import { ColetaItem, StatusColeta } from "@/_data/coletas";
import { bateDocumento, normalizarTexto } from "@/lib/search-utils";
import { PackagePlus, Calendar, CheckCircle2, Clock3, Search } from "lucide-react";
import Link from "next/link";

interface ColetaListClientProps {
  initialColetas: ColetaItem[];
  allCount: number;
  criadasCount: number;
  retiradasCount: number;
}

export function ColetaListClient({
  initialColetas,
  allCount,
  criadasCount,
  retiradasCount,
}: ColetaListClientProps) {
  const [filtroStatus, setFiltroStatus] = useState<"todos" | StatusColeta>("todos");
  const [buscaLocal, setBuscaLocal] = useState("");

  const coletasFiltradas = initialColetas.filter((item) => {
    // 1. Filtro local de Status (todos / criada / retirada)
    if (filtroStatus !== "todos" && item.status !== filtroStatus) {
      return false;
    }

    // 2. Filtro digitado no input em tela
    if (buscaLocal) {
      const buscadoLocal = normalizarTexto(buscaLocal);
      const matchAg = normalizarTexto(item.codigoAgendamento).includes(buscadoLocal);
      const matchEnc = normalizarTexto(item.codigoEncomenda).includes(buscadoLocal);
      const matchNome = normalizarTexto(item.destinatario.nome).includes(buscadoLocal);
      const matchCidade = normalizarTexto(item.pontoRetirada.cidade).includes(buscadoLocal);
      const matchCpf =
        bateDocumento(item.destinatario.documento, buscaLocal) ||
        bateDocumento(item.remetente.documento, buscaLocal);

      if (!matchAg && !matchEnc && !matchNome && !matchCidade && !matchCpf) {
        return false;
      }
    }

    return true;
  });

  return (
    <>
      {/* Filtros e Busca Local */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 w-full sm:w-auto">
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
            onClick={() => setFiltroStatus("criada")}
            className={`win95-btn px-3 py-1 font-bold ${
              filtroStatus === "criada" ? "bg-[#000080] text-white" : ""
            }`}
          >
            Criadas ({criadasCount})
          </button>
          <button
            type="button"
            onClick={() => setFiltroStatus("retirada")}
            className={`win95-btn px-3 py-1 font-bold ${
              filtroStatus === "retirada" ? "bg-[#000080] text-white" : ""
            }`}
          >
            Retiradas ({retiradasCount})
          </button>
        </div>

        <div className="w-full sm:w-72 relative">
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

      {/* Lista de Cards de Coletas */}
      <div className="space-y-4">
        {coletasFiltradas.length === 0 ? (
          <div className="win95-sunken bg-white p-8 text-center space-y-2">
            <PackagePlus className="w-8 h-8 text-[#808080] mx-auto opacity-50" />
            <p className="text-xs text-[#404040] font-bold">
              Nenhuma coleta encontrada para os parâmetros informados.
            </p>
            <div className="pt-2">
              <Link href="/ssw/101" className="win95-btn px-3 py-1 text-xs font-bold inline-block">
                Ver todas as coletas
              </Link>
            </div>
          </div>
        ) : (
          coletasFiltradas.map((coleta) => {
            const isRetirada = coleta.status === "retirada";

            return (
              <div
                key={coleta.id}
                className="win95-raised p-4 bg-[#C0C0C0] space-y-3"
              >
                {/* Topo do Card: Identificação + Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#808080]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#000080]">
                      {coleta.codigoAgendamento}
                    </span>
                    <span className="font-mono text-[11px] px-1.5 py-0.5 win95-sunken bg-white text-[#404040]">
                      {coleta.id}
                    </span>
                    <span className="font-mono text-[11px] px-1.5 py-0.5 win95-sunken bg-white text-[#404040]">
                      Ref: {coleta.codigoEncomenda}
                    </span>
                    <span className="font-mono text-[11px] px-1.5 py-0.5 win95-sunken bg-white text-[#404040]">
                      NF: {coleta.nf}
                    </span>
                  </div>

                  {/* Badge de Status: criada ou retirada */}
                  <div>
                    {isRetirada ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold font-mono bg-[#E0FFE0] text-[#006000] border-2 border-[#008000]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#008000]" />
                        <span>STATUS: RETIRADA</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold font-mono bg-[#E0E8FF] text-[#000080] border-2 border-[#000080]">
                        <Clock3 className="w-3.5 h-3.5 text-[#000080]" />
                        <span>STATUS: CRIADA</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Dados da Coleta: Destinatário, Remetente e Ponto */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Destinatário com CPF */}
                  <div className="win95-sunken bg-white p-3 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#808080] block">
                      Destinatário (Titular da Retirada)
                    </span>
                    <p className="font-bold text-black text-sm">
                      {coleta.destinatario.nome}
                    </p>
                    {coleta.destinatario.documento && (
                      <p className="font-mono text-[#000080] text-[11px] font-bold">
                        CPF/Doc: {coleta.destinatario.documento}
                      </p>
                    )}
                    <p className="text-[11px] text-[#404040]">
                      Tel: {coleta.destinatario.telefone}
                    </p>
                  </div>

                  {/* Remetente com CPF/CNPJ */}
                  <div className="win95-sunken bg-white p-3 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#808080] block">
                      Remetente (Origem)
                    </span>
                    <p className="font-bold text-black text-sm">
                      {coleta.remetente.nome}
                    </p>
                    {coleta.remetente.documento && (
                      <p className="font-mono text-[#000080] text-[11px] font-bold">
                        CNPJ/CPF: {coleta.remetente.documento}
                      </p>
                    )}
                    <p className="text-[11px] text-[#404040]">
                      {coleta.remetente.cidade} - {coleta.remetente.uf}
                    </p>
                  </div>

                  {/* Agendamento & Local */}
                  <div className="win95-sunken bg-white p-3 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#000080] block">
                      Agendamento & Local
                    </span>
                    <div className="flex items-center gap-1.5 text-black font-bold">
                      <Calendar className="w-3.5 h-3.5 text-[#000080]" />
                      <span>Dia: {coleta.dataAgendadaColeta} às {coleta.horarioAgendado}</span>
                    </div>
                    <p className="text-[11px] font-bold text-black">
                      {coleta.pontoRetirada.nomeUnidade}
                    </p>
                    <p className="text-[10px] text-[#404040]">
                      {coleta.pontoRetirada.cidade} - {coleta.pontoRetirada.uf}
                    </p>
                  </div>
                </div>

                {/* Rodapé do Card com Observações e Situação */}
                <div className="win95-sunken bg-[#F5F5F5] p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#404040]">Exigência:</span>
                    <span className="text-black font-mono">{coleta.documentoRetiradaExigido}</span>
                  </div>

                  {isRetirada ? (
                    <div className="text-[#006000] font-bold font-mono">
                      ✓ Retirada confirmada em {coleta.dataEfetivaRetirada}
                    </div>
                  ) : (
                    <div className="text-[#000080] font-bold font-mono">
                      ⏳ Aguardando comparecimento do destinatário
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
