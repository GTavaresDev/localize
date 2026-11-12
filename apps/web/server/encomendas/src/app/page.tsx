import Link from "next/link";
import { encomendas, StatusEncomenda } from "@/_data/encomendas";
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

function getStatusConfig(status: StatusEncomenda) {
  switch (status) {
    case "Saiu para Entrega":
      return {
        icon: <TruckIcon className="w-3.5 h-3.5 text-[#BF00FF]" />,
        badge: "bg-[#BF00FF]/10 text-[#8e00be] border-[#BF00FF]/30",
        dot: "bg-[#BF00FF] shadow-[0_0_8px_#BF00FF]",
      };
    case "Em Trânsito":
      return {
        icon: <PackageIcon className="w-3.5 h-3.5 text-[#BF00FF]" />,
        badge: "bg-[#BF00FF]/10 text-[#8e00be] border-[#BF00FF]/25",
        dot: "bg-[#BF00FF]",
      };
    case "Entregue":
      return {
        icon: <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" />,
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-600",
      };
    case "Cancelado":
      return {
        icon: <XCircleIcon className="w-3.5 h-3.5 text-rose-600" />,
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        dot: "bg-rose-600",
      };
    case "Pendente":
    default:
      return {
        icon: <ClockIcon className="w-3.5 h-3.5 text-amber-600" />,
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-600",
      };
  }
}

export default function Home() {
  const total = encomendas.length;
  const emTransito = encomendas.filter(
    (e) => e.statusAtual === "Em Trânsito" || e.statusAtual === "Saiu para Entrega"
  ).length;
  const entregues = encomendas.filter((e) => e.statusAtual === "Entregue").length;

  return (
    <div className="min-h-screen bg-[#0F1012] text-neutral-100 selection:bg-[#BF00FF]/30 selection:text-white">
      {/* Glow decorativo sutil no topo */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-[#BF00FF]/10 blur-[130px] rounded-full -z-0" />

      {/* Header Minimalista */}
      <header className="sticky top-0 z-20 border-b border-[#26272E] bg-[#0F1012]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-[#17181C] border border-[#26272E] text-[#BF00FF] shadow-inner group">
              <BoxIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#BF00FF] ring-2 ring-[#0F1012]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-white">
                  Localize
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#4A4A4A] px-1.5 py-0.5 rounded border border-[#26272E] bg-[#17181C]">
                  Logistics
                </span>
              </div>
              <p className="text-[11px] text-[#8C8C8C] leading-none">
                Gestão e Rastreabilidade de Encomendas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#17181C] border border-[#26272E] text-neutral-300">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BF00FF] animate-pulse" />
              <span>{total} remessas monitoradas</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-10">
        
        {/* Hero Section & Métricas Rápidas */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#26272E]">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white">
              Painel de <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-[#BF00FF]">Encomendas</span>
            </h1>
            <p className="text-sm text-[#8C8C8C] mt-1.5 max-w-lg">
              Acompanhamento inteligente de remessas com atualização em tempo real e histórico auditável de cada movimentação.
            </p>
          </div>

          {/* Mini Dashboard de Status */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-xl bg-[#17181C] border border-[#26272E] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#BF00FF]/10 border border-[#BF00FF]/30 flex items-center justify-center text-[#BF00FF]">
                <TruckIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-mono">Em Rota</p>
                <p className="text-base font-semibold text-white">{emTransito}</p>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-xl bg-[#17181C] border border-[#26272E] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircleIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-mono">Entregues</p>
                <p className="text-base font-semibold text-white">{entregues}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Cards de Encomendas - Fundo Branco e Letra Preta */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8C8C8C] flex items-center gap-2">
              <PackageIcon className="w-3.5 h-3.5 text-[#BF00FF]" />
              Remessas Cadastradas
            </span>
            <span className="text-xs text-[#8C8C8C]">
              Mostrando {total} itens
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {encomendas.map((item) => {
              const statusCfg = getStatusConfig(item.statusAtual);
              return (
                <Link
                  key={item.id}
                  href={`/encomendas/${item.id}`}
                  className="group relative flex flex-col justify-between rounded-xl bg-white border border-[#E5E5E7] p-5 shadow-xs transition-all duration-200 hover:border-[#BF00FF] hover:shadow-[0_8px_24px_rgba(191,0,255,0.18)] hover:-translate-y-0.5"
                >
                  {/* Top: Tracking ID + Badge */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold tracking-wider text-black group-hover:text-[#BF00FF] transition-colors">
                            {item.id}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-[#4A4A4A] block mt-0.5">
                          {item.nf}
                        </span>
                      </div>

                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusCfg.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                        <span>{item.statusAtual}</span>
                      </div>
                    </div>

                    {/* Origem & Destino */}
                    <div className="space-y-3 py-3 border-y border-stone-200 text-xs">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 text-[#4A4A4A]">
                          <div className="w-2.5 h-2.5 rounded-full border-2 border-[#4A4A4A] bg-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-[#4A4A4A] font-semibold block">
                            Origem
                          </span>
                          <p className="text-black font-semibold truncate text-xs">
                            {item.remetente.nome}
                          </p>
                          <span className="text-[11px] text-[#4A4A4A]">
                            {item.remetente.cidade}, {item.remetente.uf}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 text-[#BF00FF]">
                          <MapPinIcon className="w-3 h-3 text-[#BF00FF]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-[#4A4A4A] font-semibold block">
                            Destino
                          </span>
                          <p className="text-black font-semibold truncate text-xs">
                            {item.destinatario.nome}
                          </p>
                          <span className="text-[11px] text-[#4A4A4A]">
                            {item.destinatario.cidade}, {item.destinatario.uf}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Datas + Link Arrow */}
                  <div className="mt-4 pt-2 flex items-center justify-between text-[11px] text-[#4A4A4A]">
                    <div>
                      <span>Previsão: </span>
                      <span className="text-black font-semibold">
                        {item.previsaoEntrega}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1 font-semibold text-black group-hover:text-[#BF00FF] transition-colors">
                      <span>Rastrear</span>
                      <ArrowUpRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
