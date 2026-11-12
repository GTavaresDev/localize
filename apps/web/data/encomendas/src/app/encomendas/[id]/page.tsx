import Link from "next/link";
import { notFound } from "next/navigation";
import { encomendas, StatusEncomenda } from "@/_data/encomendas";
import {
  PackageIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MapPinIcon,
  ArrowLeftIcon,
  BuildingIcon,
  UserIcon,
  FileTextIcon,
  CalendarIcon,
  PhoneIcon,
  MailIcon,
} from "@/components/icons";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function getStatusConfig(status: StatusEncomenda) {
  switch (status) {
    case "Saiu para Entrega":
      return {
        icon: <TruckIcon className="w-4 h-4 text-[#BF00FF]" />,
        badge: "bg-[#BF00FF]/10 text-[#8e00be] border-[#BF00FF]/30",
        dot: "bg-[#BF00FF] shadow-[0_0_8px_#BF00FF]",
      };
    case "Em Trânsito":
      return {
        icon: <PackageIcon className="w-4 h-4 text-[#BF00FF]" />,
        badge: "bg-[#BF00FF]/10 text-[#8e00be] border-[#BF00FF]/25",
        dot: "bg-[#BF00FF]",
      };
    case "Entregue":
      return {
        icon: <CheckCircleIcon className="w-4 h-4 text-emerald-600" />,
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-600",
      };
    case "Cancelado":
      return {
        icon: <XCircleIcon className="w-4 h-4 text-rose-600" />,
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        dot: "bg-rose-600",
      };
    case "Pendente":
    default:
      return {
        icon: <ClockIcon className="w-4 h-4 text-amber-600" />,
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        dot: "bg-amber-600",
      };
  }
}

export async function generateStaticParams() {
  return encomendas.map((e) => ({
    id: e.id,
  }));
}

export default async function EncomendaDetalhesPage({ params }: PageProps) {
  const { id } = await params;
  const encomenda = encomendas.find((e) => e.id.toLowerCase() === id.toLowerCase());

  if (!encomenda) {
    notFound();
  }

  const statusCfg = getStatusConfig(encomenda.statusAtual);

  return (
    <div className="min-h-screen bg-[#0F1012] text-neutral-100 selection:bg-[#BF00FF]/30 selection:text-white">
      {/* Glow decorativo sutil de fundo do site */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] bg-[#BF00FF]/10 blur-[130px] rounded-full -z-0" />

      {/* Top Header do Site (Dark) */}
      <header className="sticky top-0 z-20 border-b border-[#26272E] bg-[#0F1012]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg bg-[#17181C] border border-[#26272E] text-neutral-300 hover:text-white hover:border-[#BF00FF]/50 transition-colors group"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-[#BF00FF]" />
            <span>Voltar ao painel</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#8C8C8C] uppercase tracking-wider">
              Código:
            </span>
            <span className="font-mono text-xs font-semibold text-white px-2.5 py-1 rounded bg-[#17181C] border border-[#26272E]">
              {encomenda.id}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content - Card Central com Fundo Branco e Letra Preta */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-10">
        <div className="rounded-2xl border border-[#E5E5E7] bg-white text-black p-6 sm:p-8 space-y-8 shadow-[0_16px_48px_rgba(0,0,0,0.35)]">
          
          {/* Card Header: Título, Status e Metadados */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-stone-200">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold font-mono tracking-tight text-black">
                  {encomenda.id}
                </h1>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusCfg.badge}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                  <span>{encomenda.statusAtual}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#4A4A4A] mt-2 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <FileTextIcon className="w-3.5 h-3.5 text-[#4A4A4A]" />
                  Nota Fiscal: <strong className="text-black font-mono font-bold">{encomenda.nf}</strong>
                </span>
              </div>
            </div>

            <div className="flex sm:flex-col items-start sm:items-end justify-between gap-2 text-xs border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-200">
              <div className="flex items-center gap-1.5 text-[#4A4A4A]">
                <CalendarIcon className="w-3.5 h-3.5 text-[#4A4A4A]" />
                <span>Envio:</span>
                <span className="text-black font-mono font-bold">{encomenda.dataEnvio}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#4A4A4A]">
                <ClockIcon className="w-3.5 h-3.5 text-[#BF00FF]" />
                <span>Previsão:</span>
                <span className="text-[#BF00FF] font-mono font-bold">{encomenda.previsaoEntrega}</span>
              </div>
            </div>
          </div>

          {/* Cards Internos: Remetente vs Destinatário */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Remetente */}
            <div className="rounded-xl border border-stone-200 bg-[#F9F9FA] p-5 relative overflow-hidden group hover:border-[#4A4A4A] transition-colors">
              <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#4A4A4A] to-transparent" />
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-[#4A4A4A] uppercase tracking-wider flex items-center gap-1.5">
                  <BuildingIcon className="w-3.5 h-3.5 text-[#4A4A4A]" />
                  Remetente
                </span>
                {encomenda.remetente.documento && (
                  <span className="text-[10px] font-mono text-[#4A4A4A]">
                    {encomenda.remetente.documento}
                  </span>
                )}
              </div>

              <p className="font-bold text-sm text-black">
                {encomenda.remetente.nome}
              </p>

              {encomenda.remetente.endereco && (
                <p className="text-xs text-black mt-2 font-medium">
                  {encomenda.remetente.endereco}
                </p>
              )}
              <p className="text-xs text-[#4A4A4A] mt-0.5">
                {encomenda.remetente.cidade} - {encomenda.remetente.uf}
              </p>

              {(encomenda.remetente.telefone || encomenda.remetente.email) && (
                <div className="mt-4 pt-3 border-t border-stone-200 text-[11px] text-[#4A4A4A] space-y-1">
                  {encomenda.remetente.telefone && (
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-3 h-3 text-[#4A4A4A]" />
                      <span>{encomenda.remetente.telefone}</span>
                    </div>
                  )}
                  {encomenda.remetente.email && (
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-3 h-3 text-[#4A4A4A]" />
                      <span className="truncate">{encomenda.remetente.email}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Destinatário */}
            <div className="rounded-xl border border-stone-200 bg-[#F9F9FA] p-5 relative overflow-hidden group hover:border-[#BF00FF]/60 transition-colors">
              <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-[#BF00FF] to-transparent" />

              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-[#BF00FF] uppercase tracking-wider flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5" />
                  Destinatário
                </span>
                {encomenda.destinatario.documento && (
                  <span className="text-[10px] font-mono text-[#4A4A4A]">
                    {encomenda.destinatario.documento}
                  </span>
                )}
              </div>

              <p className="font-bold text-sm text-black">
                {encomenda.destinatario.nome}
              </p>

              {encomenda.destinatario.endereco && (
                <p className="text-xs text-black mt-2 font-medium">
                  {encomenda.destinatario.endereco}
                </p>
              )}
              <p className="text-xs text-[#4A4A4A] mt-0.5">
                {encomenda.destinatario.cidade} - {encomenda.destinatario.uf}
              </p>

              {(encomenda.destinatario.telefone || encomenda.destinatario.email) && (
                <div className="mt-4 pt-3 border-t border-stone-200 text-[11px] text-[#4A4A4A] space-y-1">
                  {encomenda.destinatario.telefone && (
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-3 h-3 text-[#BF00FF]" />
                      <span>{encomenda.destinatario.telefone}</span>
                    </div>
                  )}
                  {encomenda.destinatario.email && (
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-3 h-3 text-[#BF00FF]" />
                      <span className="truncate">{encomenda.destinatario.email}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Timeline de Rastreamento */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-mono font-bold text-[#4A4A4A] uppercase tracking-wider flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-[#BF00FF]" />
                Linha do Tempo de Rastreamento
              </h2>
              <span className="text-[11px] text-[#4A4A4A] font-mono font-medium">
                {encomenda.detalhesRastreamento.length} eventos
              </span>
            </div>

            <div className="relative border-l-2 border-stone-200 ml-3 space-y-7 pl-6">
              {encomenda.detalhesRastreamento.map((evento, index) => {
                const isLatest = index === encomenda.detalhesRastreamento.length - 1;
                return (
                  <div key={index} className="relative group">
                    {/* Marcador do evento na timeline */}
                    <span
                      className={`absolute -left-[32px] top-1 h-3 w-3 rounded-full border-2 border-white transition-all duration-300 ${
                        isLatest
                          ? "bg-[#BF00FF] ring-4 ring-[#BF00FF]/25 shadow-[0_0_10px_#BF00FF]"
                          : "bg-[#4A4A4A] group-hover:bg-black"
                      }`}
                    />

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] text-[#4A4A4A] font-medium">
                          {evento.dataHora}
                        </span>
                        <span className="text-stone-400 text-xs">•</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            isLatest
                              ? "bg-[#BF00FF]/10 text-[#8e00be] border-[#BF00FF]/30 font-semibold"
                              : "bg-[#F9F9FA] text-[#4A4A4A] border-stone-200"
                          }`}
                        >
                          {evento.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-3.5 h-3.5 text-[#BF00FF]" />
                        <h3 className="text-xs font-bold text-black">
                          {evento.local}
                        </h3>
                      </div>

                      <p className="text-xs text-black mt-1.5 leading-relaxed bg-[#F9F9FA] border border-stone-200 rounded-lg p-3">
                        {evento.descricao}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Card com Ações */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <span className="text-[11px] text-[#4A4A4A]">
              Dados sincronizados via Localize Network
            </span>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-[#BF00FF] hover:bg-[#a600df] text-white text-xs font-bold tracking-wide transition-all duration-200 shadow-xs hover:shadow-[0_4px_16px_rgba(191,0,255,0.25)] active:scale-95"
            >
              Concluir Consulta
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
