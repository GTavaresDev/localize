import Link from "next/link";
import { encomendas, StatusEncomenda } from "@/_data/encomendas";

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

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fbf9f5] text-black">
      {/* Header Minimalista Shadcn */}
      <header className="border-b border-[#e8e2d8] bg-[#fbf9f5]/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1717b3] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-xs">
              EN
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-black">
                Localize Encomendas
              </h1>
              <p className="text-xs text-stone-600">
                Rastreamento e logística
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#ede7dd] text-black border border-[#dcd3c4]">
            {encomendas.length} ativas
          </span>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-black">
            Remessas
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Selecione uma remessa para consultar o trajeto e os dados completos.
          </p>
        </div>

        {/* Lista com Cards no padrão Shadcn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {encomendas.map((item) => (
            <Link
              key={item.id}
              href={`/encomendas/${item.id}`}
              className="group block rounded-xl border border-[#e8e2d8] bg-white p-5 transition-all hover:border-[#1717b3] hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1717b3]"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-black tracking-tight">
                    {item.id}
                  </span>
                  <span className="text-stone-300 mx-2">|</span>
                  <span className="text-xs text-stone-500 font-medium">{item.nf}</span>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${getStatusBadge(
                    item.statusAtual
                  )}`}
                >
                  {item.statusAtual}
                </span>
              </div>

              <div className="space-y-2 text-xs border-t border-stone-100 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-normal">De:</span>
                  <span className="font-semibold text-black truncate max-w-[240px]">
                    {item.remetente.nome} ({item.remetente.cidade}/{item.remetente.uf})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500 font-normal">Para:</span>
                  <span className="font-semibold text-black truncate max-w-[240px]">
                    {item.destinatario.nome} ({item.destinatario.cidade}/{item.destinatario.uf})
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>Envio: {item.dataEnvio}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#1717b3] group-hover:underline">
                  Ver detalhes →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
