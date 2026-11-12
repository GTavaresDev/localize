import Link from "next/link";
import { notFound } from "next/navigation";
import { encomendas, StatusEncomenda } from "@/_data/encomendas";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function getStatusBadge(status: StatusEncomenda) {
  switch (status) {
    case "Saiu para Entrega":
      return "bg-[#1717b3] text-white border-[#1717b3]";
    case "Entregue":
      return "bg-[#ede7dd] text-black border-[#dcd3c4]";
    case "Em Trânsito":
      return "bg-white text-[#1717b3] border-[#1717b3]/30";
    case "Cancelado":
      return "bg-stone-200 text-stone-500 border-stone-300 line-through";
    case "Pendente":
    default:
      return "bg-[#ede7dd] text-black border-[#dcd3c4]";
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

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-black">
      {/* Topo / Header com Botão Minimalista */}
      <header className="border-b border-[#e8e2d8] bg-[#fbf9f5]/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-[#e8e2d8] text-[#1717b3] hover:bg-[#ede7dd]/40 transition-colors"
          >
            ← Voltar para a lista
          </Link>
          <span className="font-mono text-xs font-bold text-stone-500">
            {encomenda.id}
          </span>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="rounded-xl border border-[#e8e2d8] bg-white p-6 sm:p-8 space-y-8 shadow-xs">
          
          {/* Header da Encomenda */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold font-mono tracking-tight text-black">
                  {encomenda.id}
                </h1>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${getStatusBadge(
                    encomenda.statusAtual
                  )}`}
                >
                  {encomenda.statusAtual}
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Nota Fiscal: <span className="font-mono font-medium text-black">{encomenda.nf}</span>
              </p>
            </div>

            <div className="text-xs text-stone-600 sm:text-right space-y-1">
              <div>Envio: <span className="text-black font-semibold">{encomenda.dataEnvio}</span></div>
              <div>Previsão: <span className="text-black font-semibold">{encomenda.previsaoEntrega}</span></div>
            </div>
          </div>

          {/* Cards Remetente / Destinatário */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Remetente */}
            <div className="rounded-lg border border-[#e8e2d8] bg-[#fbf9f5] p-5">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                Remetente
              </span>
              <p className="font-bold text-sm text-black">
                {encomenda.remetente.nome}
              </p>
              {encomenda.remetente.documento && (
                <p className="text-xs text-stone-600 mt-0.5">
                  Doc: {encomenda.remetente.documento}
                </p>
              )}
              {encomenda.remetente.endereco && (
                <p className="text-xs text-stone-700 mt-2 font-medium">
                  {encomenda.remetente.endereco}
                </p>
              )}
              <p className="text-xs text-stone-600">
                {encomenda.remetente.cidade} - {encomenda.remetente.uf}
              </p>
              {(encomenda.remetente.telefone || encomenda.remetente.email) && (
                <div className="mt-3 pt-2 border-t border-[#e8e2d8] text-[11px] text-stone-600 space-y-0.5">
                  {encomenda.remetente.telefone && <div>Tel: {encomenda.remetente.telefone}</div>}
                  {encomenda.remetente.email && <div>E-mail: {encomenda.remetente.email}</div>}
                </div>
              )}
            </div>

            {/* Destinatário */}
            <div className="rounded-lg border border-[#e8e2d8] bg-[#fbf9f5] p-5">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1.5">
                Destinatário
              </span>
              <p className="font-bold text-sm text-black">
                {encomenda.destinatario.nome}
              </p>
              {encomenda.destinatario.documento && (
                <p className="text-xs text-stone-600 mt-0.5">
                  Doc: {encomenda.destinatario.documento}
                </p>
              )}
              {encomenda.destinatario.endereco && (
                <p className="text-xs text-stone-700 mt-2 font-medium">
                  {encomenda.destinatario.endereco}
                </p>
              )}
              <p className="text-xs text-stone-600">
                {encomenda.destinatario.cidade} - {encomenda.destinatario.uf}
              </p>
              {(encomenda.destinatario.telefone || encomenda.destinatario.email) && (
                <div className="mt-3 pt-2 border-t border-[#e8e2d8] text-[11px] text-stone-600 space-y-0.5">
                  {encomenda.destinatario.telefone && <div>Tel: {encomenda.destinatario.telefone}</div>}
                  {encomenda.destinatario.email && <div>E-mail: {encomenda.destinatario.email}</div>}
                </div>
              )}
            </div>
          </div>

          {/* Timeline de Rastreamento */}
          <div className="pt-2">
            <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-6">
              Histórico de Rastreamento
            </h2>
            <div className="relative border-l border-stone-200 ml-2 space-y-6 pl-5">
              {encomenda.detalhesRastreamento.map((evento, index) => {
                const isLatest = index === encomenda.detalhesRastreamento.length - 1;
                return (
                  <div key={index} className="relative group">
                    {/* Indicador com a cor azul #1717b3 */}
                    <span
                      className={`absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white ${
                        isLatest ? "bg-[#1717b3] ring-2 ring-[#1717b3]/20" : "bg-stone-300"
                      }`}
                    />
                    <div>
                      <span className="font-mono text-[11px] text-stone-500 block mb-0.5">
                        {evento.dataHora}
                      </span>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-black">
                          {evento.local}
                        </h3>
                        <span className="text-[10px] text-stone-500 font-mono">
                          • {evento.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {evento.descricao}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botão de Ação no Rodapé */}
          <div className="pt-4 border-t border-stone-100 flex justify-end">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-[#1717b3] text-white text-xs font-semibold hover:bg-[#121290] transition-colors shadow-xs"
            >
              Concluir Consulta
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
