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
import { LogoutButton } from "@/components/logout-button";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function getStatusConfig(status: StatusEncomenda) {
  switch (status) {
    case "Saiu para Entrega":
      return {
        icon: <TruckIcon className="w-4 h-4 text-[#000080]" />,
        badge: "bg-[#E0E8FF] text-[#000080] border-[#000080]",
        dot: "bg-[#000080]",
      };
    case "Em Trânsito":
      return {
        icon: <PackageIcon className="w-4 h-4 text-[#000080]" />,
        badge: "bg-[#E8ECFF] text-[#000080] border-[#000080]",
        dot: "bg-[#000080]",
      };
    case "Entregue":
      return {
        icon: <CheckCircleIcon className="w-4 h-4 text-[#008000]" />,
        badge: "bg-[#E0FFE0] text-[#006000] border-[#008000]",
        dot: "bg-[#008000]",
      };
    case "Cancelado":
      return {
        icon: <XCircleIcon className="w-4 h-4 text-[#800000]" />,
        badge: "bg-[#FFE0E0] text-[#800000] border-[#800000]",
        dot: "bg-[#800000]",
      };
    case "Pendente":
    default:
      return {
        icon: <ClockIcon className="w-4 h-4 text-[#808000]" />,
        badge: "bg-[#FFFFD0] text-[#606000] border-[#808000]",
        dot: "bg-[#808000]",
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
    <div className="min-h-screen bg-white text-black selection:bg-[#000080] selection:text-white">
      {/* Top Header do Site */}
      <header className="sticky top-0 z-20 win95-raised bg-[#C0C0C0]">
        <div
          aria-hidden="true"
          className="win95-titlebar bg-[#000080] text-white px-3 py-1 flex items-center justify-end gap-1"
        >
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

        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 win95-btn text-black group"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5 text-[#000080]" />
            <span>Voltar ao painel</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-[#404040] uppercase tracking-wider">
                Código:
              </span>
              <span className="font-mono text-xs font-bold text-black px-2.5 py-1 win95-sunken bg-white">
                {encomenda.id}
              </span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content - Janela Central Retrô */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="win95-raised p-1 bg-[#C0C0C0]">
          <div className="win95-sunken bg-white text-black p-6 sm:p-8 space-y-8">
          
          {/* Card Header: Título, Status e Metadados */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b-2 border-[#808080]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold font-mono tracking-tight text-[#000080]">
                  {encomenda.id}
                </h1>
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold border ${statusCfg.badge}`}
                >
                  <span className={`w-2 h-2 ${statusCfg.dot}`} />
                  <span>{encomenda.statusAtual}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#404040] mt-2 font-medium">
                <span className="inline-flex items-center gap-1.5">
                  <FileTextIcon className="w-3.5 h-3.5 text-[#404040]" />
                  Nota Fiscal: <strong className="text-black font-mono font-bold">{encomenda.nf}</strong>
                </span>
              </div>
            </div>

            <div className="flex sm:flex-col items-start sm:items-end justify-between gap-2 text-xs border-t sm:border-t-0 pt-3 sm:pt-0 border-[#808080]">
              <div className="flex items-center gap-1.5 text-[#404040]">
                <CalendarIcon className="w-3.5 h-3.5 text-[#404040]" />
                <span>Envio:</span>
                <span className="text-black font-mono font-bold">{encomenda.dataEnvio}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#404040]">
                <ClockIcon className="w-3.5 h-3.5 text-[#000080]" />
                <span>Previsão:</span>
                <span className="text-[#000080] font-mono font-bold">{encomenda.previsaoEntrega}</span>
              </div>
            </div>
          </div>

          {/* Cards Internos: Remetente vs Destinatário */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Remetente */}
            <div className="win95-raised bg-[#C0C0C0] p-4 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-[#404040] uppercase tracking-wider flex items-center gap-1.5">
                  <BuildingIcon className="w-3.5 h-3.5 text-[#404040]" />
                  Remetente
                </span>
                {encomenda.remetente.documento && (
                  <span className="text-[10px] font-mono text-[#404040]">
                    {encomenda.remetente.documento}
                  </span>
                )}
              </div>

              <div className="win95-sunken bg-white p-3">
                <p className="font-bold text-sm text-black">
                  {encomenda.remetente.nome}
                </p>

                {encomenda.remetente.endereco && (
                  <p className="text-xs text-black mt-2 font-medium">
                    {encomenda.remetente.endereco}
                  </p>
                )}
                <p className="text-xs text-[#404040] mt-0.5">
                  {encomenda.remetente.cidade} - {encomenda.remetente.uf}
                </p>

                {(encomenda.remetente.telefone || encomenda.remetente.email) && (
                  <div className="mt-3 pt-2.5 border-t border-[#DFDFDF] text-[11px] text-[#404040] space-y-1">
                    {encomenda.remetente.telefone && (
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-3 h-3 text-[#404040]" />
                        <span>{encomenda.remetente.telefone}</span>
                      </div>
                    )}
                    {encomenda.remetente.email && (
                      <div className="flex items-center gap-2">
                        <MailIcon className="w-3 h-3 text-[#404040]" />
                        <span className="truncate">{encomenda.remetente.email}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Destinatário */}
            <div className="win95-raised bg-[#C0C0C0] p-4 relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono font-bold text-[#000080] uppercase tracking-wider flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5" />
                  Destinatário
                </span>
                {encomenda.destinatario.documento && (
                  <span className="text-[10px] font-mono text-[#404040]">
                    {encomenda.destinatario.documento}
                  </span>
                )}
              </div>

              <div className="win95-sunken bg-white p-3">
                <p className="font-bold text-sm text-black">
                  {encomenda.destinatario.nome}
                </p>

                {encomenda.destinatario.endereco && (
                  <p className="text-xs text-black mt-2 font-medium">
                    {encomenda.destinatario.endereco}
                  </p>
                )}
                <p className="text-xs text-[#404040] mt-0.5">
                  {encomenda.destinatario.cidade} - {encomenda.destinatario.uf}
                </p>

                {(encomenda.destinatario.telefone || encomenda.destinatario.email) && (
                  <div className="mt-3 pt-2.5 border-t border-[#DFDFDF] text-[11px] text-[#404040] space-y-1">
                    {encomenda.destinatario.telefone && (
                      <div className="flex items-center gap-2">
                        <PhoneIcon className="w-3 h-3 text-[#000080]" />
                        <span>{encomenda.destinatario.telefone}</span>
                      </div>
                    )}
                    {encomenda.destinatario.email && (
                      <div className="flex items-center gap-2">
                        <MailIcon className="w-3 h-3 text-[#000080]" />
                        <span className="truncate">{encomenda.destinatario.email}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Timeline de Rastreamento */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-mono font-bold text-black uppercase tracking-wider flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-[#000080]" />
                Linha do Tempo de Rastreamento
              </h2>
              <span className="text-[11px] text-[#404040] font-mono font-bold">
                {encomenda.detalhesRastreamento.length} eventos
              </span>
            </div>

            <div className="relative border-l-2 border-[#808080] ml-3 space-y-6 pl-6">
              {encomenda.detalhesRastreamento.map((evento, index) => {
                const isLatest = index === encomenda.detalhesRastreamento.length - 1;
                return (
                  <div key={index} className="relative group">
                    {/* Marcador do evento na timeline */}
                    <span
                      className={`absolute -left-[31px] top-1 h-3 w-3 border-2 border-white ${
                        isLatest
                          ? "bg-[#000080] ring-1 ring-[#000080]"
                          : "bg-[#808080] group-hover:bg-black"
                      }`}
                    />

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] text-[#404040] font-bold">
                          {evento.dataHora}
                        </span>
                        <span className="text-[#808080] text-xs">•</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 border ${
                            isLatest
                              ? "bg-[#E0E8FF] text-[#000080] border-[#000080] font-bold"
                              : "bg-[#F0F0F0] text-[#404040] border-[#808080]"
                          }`}
                        >
                          {evento.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-3.5 h-3.5 text-[#000080]" />
                        <h3 className="text-xs font-bold text-black">
                          {evento.local}
                        </h3>
                      </div>

                      <p className="text-xs text-black mt-1.5 leading-relaxed win95-sunken bg-[#F4F4F4] p-3">
                        {evento.descricao}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Card com Ações */}
          <div className="pt-4 border-t-2 border-[#808080] flex items-center justify-between">
            <span className="text-[11px] text-[#404040] font-mono">
              Dados sincronizados via Localize Network
            </span>
            <Link
              href="/"
              className="px-4 py-2 bg-[#000080] hover:bg-[#0000A8] text-white text-xs font-bold tracking-wide border-t-2 border-l-2 border-[#6B8BFF] border-r-2 border-b-2 border-[#000040] active:translate-px"
            >
              Concluir Consulta
            </Link>
          </div>

          </div>
        </div>
      </main>
    </div>
  );
}
