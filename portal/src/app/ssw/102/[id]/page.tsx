import Link from "next/link";
import { notFound } from "next/navigation";
import { cotacoesCadastradas } from "@/_data/cotacoes";
import {
  ArrowLeft,
  Calculator,
  Calendar,
  Clock,
  MapPin,
  Building,
  User as UserIcon,
  Package,
  Layers,
  DollarSign,
  FileText,
  Truck,
  CheckCircle2,
} from "lucide-react";

interface CotacaoDetalheProps {
  params: Promise<{ id: string }>;
}

export default async function CotacaoDetalhePage({ params }: CotacaoDetalheProps) {
  const { id } = await params;

  const cotacao = cotacoesCadastradas.find(
    (c) => c.slug === id || c.id === id || c.numeroCotacao.toLowerCase() === id.toLowerCase()
  );

  if (!cotacao) {
    notFound();
  }

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
            <span>Módulo 102 - Detalhe da Cotação: {cotacao.numeroCotacao}</span>
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
              href="/ssw/102"
              className="win95-btn px-2.5 py-1 text-xs font-bold flex items-center gap-1.5 hover:bg-[#D4D0C8]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para Cotações</span>
            </Link>
            <div className="h-6 w-[2px] bg-[#808080]" />
            <div>
              <span className="text-sm font-bold tracking-tight text-black">
                {cotacao.numeroCotacao}
              </span>
              <span className="text-[10px] text-[#000080] font-mono font-bold ml-2">
                [ID: {cotacao.id}]
              </span>
            </div>
          </div>

          <div className="text-xs font-mono win95-sunken bg-white px-3 py-1 font-bold">
            Data: {cotacao.dataCriacao}
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="win95-raised p-4 sm:p-6 bg-[#C0C0C0] space-y-6">
          {/* Top Banner Resumo */}
          <div className="win95-sunken bg-white p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#808080]">
                Cotação de Frete Comercial
              </span>
              <h1 className="text-2xl font-bold text-black flex items-center gap-2">
                <span>{cotacao.origem.cidade}/{cotacao.origem.uf}</span>
                <span className="text-[#000080]">→</span>
                <span>{cotacao.destino.cidade}/{cotacao.destino.uf}</span>
              </h1>
              <p className="text-xs text-[#404040]">
                Solicitado por <strong className="text-black">{cotacao.solicitante.nome}</strong> ({cotacao.solicitante.empresa || "Pessoa Física"})
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="win95-raised bg-[#C0C0C0] p-3 text-right">
                <span className="text-[10px] uppercase font-mono font-bold text-[#404040] block">
                  Prazo Estimado
                </span>
                <span className="text-base font-bold text-[#000080] flex items-center justify-end gap-1">
                  <Clock className="w-4 h-4" />
                  {cotacao.prazoEstimadoDias} dias úteis
                </span>
                <span className="text-[10px] text-[#404040] block">
                  Previsão: {cotacao.previsaoEntrega}
                </span>
              </div>

              <div className="win95-raised bg-[#C0C0C0] p-3 text-right">
                <span className="text-[10px] uppercase font-mono font-bold text-[#404040] block">
                  Valor Total do Frete
                </span>
                <span className="text-xl font-bold font-mono text-[#008000]">
                  {formatarMoeda(cotacao.composicaoFrete.valorTotal)}
                </span>
                <span className="text-[10px] text-[#404040] block">
                  Carga: {formatarMoeda(cotacao.valorDeclarado)}
                </span>
              </div>
            </div>
          </div>

          {/* Grid Principal de Dados */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bloco 1: Remetente (Origem) */}
            <div className="win95-raised p-4 bg-[#C0C0C0] space-y-3">
              <div className="win95-titlebar bg-[#000080] text-white px-2 py-1 text-xs font-bold flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                <span>Dados do Remetente (Origem)</span>
              </div>

              <div className="win95-sunken bg-white p-3 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-[#808080] uppercase block">Razão / Nome</span>
                  <p className="font-bold text-black">{cotacao.origem.contatoNome}</p>
                </div>
                {cotacao.origem.documento && (
                  <div>
                    <span className="text-[10px] font-mono text-[#808080] uppercase block">CNPJ / CPF</span>
                    <p className="font-mono text-black">{cotacao.origem.documento}</p>
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-mono text-[#808080] uppercase block">Endereço de Coleta</span>
                  <p className="text-black">{cotacao.origem.endereco || "Não informado"}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#DFDFDF]">
                  <div>
                    <span className="text-[10px] font-mono text-[#808080] uppercase block">Cidade / UF</span>
                    <p className="font-bold text-[#000080]">{cotacao.origem.cidade} - {cotacao.origem.uf}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#808080] uppercase block">CEP</span>
                    <p className="font-mono font-bold text-black">{cotacao.origem.cep}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 2: Destinatário (Destino) */}
            <div className="win95-raised p-4 bg-[#C0C0C0] space-y-3">
              <div className="win95-titlebar bg-[#000080] text-white px-2 py-1 text-xs font-bold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Dados do Destinatário (Destino)</span>
              </div>

              <div className="win95-sunken bg-white p-3 space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-[#808080] uppercase block">Destinatário</span>
                  <p className="font-bold text-black">{cotacao.destino.contatoNome}</p>
                </div>
                {cotacao.destino.documento && (
                  <div>
                    <span className="text-[10px] font-mono text-[#808080] uppercase block">CNPJ / CPF</span>
                    <p className="font-mono text-black">{cotacao.destino.documento}</p>
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-mono text-[#808080] uppercase block">Endereço de Entrega</span>
                  <p className="text-black">{cotacao.destino.endereco || "Não informado"}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#DFDFDF]">
                  <div>
                    <span className="text-[10px] font-mono text-[#808080] uppercase block">Cidade / UF</span>
                    <p className="font-bold text-[#000080]">{cotacao.destino.cidade} - {cotacao.destino.uf}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#808080] uppercase block">CEP</span>
                    <p className="font-mono font-bold text-black">{cotacao.destino.cep}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bloco 3: Características da Carga (Volumes, Peso e Medidas) */}
          <div className="win95-raised p-4 bg-[#C0C0C0] space-y-3">
            <div className="win95-titlebar bg-[#000080] text-white px-2 py-1 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Características da Carga (Volumes, Peso e Dimensões)</span>
              </div>
              <span className="font-mono">Peso Total: {cotacao.pesoTotalKg} kg</span>
            </div>

            <div className="win95-sunken bg-white p-3 space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-[#808080] text-[#404040] font-mono">
                      <th className="py-1 px-2">Tipo</th>
                      <th className="py-1 px-2">Qtd</th>
                      <th className="py-1 px-2">Peso Unitário</th>
                      <th className="py-1 px-2">Dimensões (C × L × A)</th>
                      <th className="py-1 px-2">Volume Total (m³)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cotacao.volumes.map((vol, idx) => {
                      const volumeM3 = ((vol.comprimentoCm * vol.larguraCm * vol.alturaCm) / 1000000) * vol.quantidade;
                      return (
                        <tr key={idx} className="border-b border-[#DFDFDF] font-mono">
                          <td className="py-2 px-2 font-bold text-black">{vol.tipo}</td>
                          <td className="py-2 px-2">{vol.quantidade} un</td>
                          <td className="py-2 px-2">{vol.pesoKg} kg</td>
                          <td className="py-2 px-2">{vol.comprimentoCm} × {vol.larguraCm} × {vol.alturaCm} cm</td>
                          <td className="py-2 px-2">{volumeM3.toFixed(3)} m³</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#808080] text-xs font-mono">
                <div>
                  <span className="text-[#404040]">Valor Declarado da Mercadoria: </span>
                  <strong className="text-black">{formatarMoeda(cotacao.valorDeclarado)}</strong>
                </div>
                <div>
                  <span className="text-[#404040]">Quantidade Total de Volumes: </span>
                  <strong className="text-black">
                    {cotacao.volumes.reduce((acc, v) => acc + v.quantidade, 0)} volumes
                  </strong>
                </div>
                <div>
                  <span className="text-[#404040]">Peso Total Tarifado: </span>
                  <strong className="text-[#000080]">{cotacao.pesoTotalKg} kg</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Bloco 4: Discriminação do Frete e Prazo */}
          <div className="win95-raised p-4 bg-[#C0C0C0] space-y-3">
            <div className="win95-titlebar bg-[#000080] text-white px-2 py-1 text-xs font-bold flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Discriminação do Valor do Frete</span>
              </div>
              <span className="font-mono text-[#FFFF00]">Total: {formatarMoeda(cotacao.composicaoFrete.valorTotal)}</span>
            </div>

            <div className="win95-sunken bg-white p-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-[#DFDFDF]">
                <span className="text-[#404040]">Frete Peso (distância × peso da carga):</span>
                <span className="font-bold text-black">{formatarMoeda(cotacao.composicaoFrete.fretePeso)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DFDFDF]">
                <span className="text-[#404040]">Frete Valor / Ad Valorem (seguro proporcional da mercadoria):</span>
                <span className="font-bold text-black">{formatarMoeda(cotacao.composicaoFrete.freteValorAdValorem)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DFDFDF]">
                <span className="text-[#404040]">Taxa de Coleta e Entrega:</span>
                <span className="font-bold text-black">{formatarMoeda(cotacao.composicaoFrete.taxaColetaEntrega)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DFDFDF]">
                <span className="text-[#404040]">GRIS (Gerenciamento de Risco da Carga):</span>
                <span className="font-bold text-black">{formatarMoeda(cotacao.composicaoFrete.gris)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DFDFDF]">
                <span className="text-[#404040]">Pedágio / Tarifas rodoviárias:</span>
                <span className="font-bold text-black">{formatarMoeda(cotacao.composicaoFrete.pedagio)}</span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t-2 border-[#808080] text-sm">
                <span className="font-bold text-black">VALOR TOTAL DO FRETE:</span>
                <span className="font-bold text-lg text-[#008000]">{formatarMoeda(cotacao.composicaoFrete.valorTotal)}</span>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/ssw/102"
              className="win95-btn px-4 py-2 text-xs font-bold flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para todas as cotações</span>
            </Link>

            <Link
              href="/"
              className="win95-btn px-4 py-2 text-xs font-bold text-[#000080]"
            >
              Ir para Tela Inicial
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
