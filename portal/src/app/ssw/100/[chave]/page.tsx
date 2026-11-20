import { notFound } from "next/navigation";
import { encomendas } from "@/_data/encomendas";
import { EncomendaDetalheView } from "@/components/encomenda-detalhe-view";
import { buscarEncomendaPorChave } from "@/lib/encomenda-search";
import { codigoNotaFiscal } from "@/lib/search-utils";

export const instant = false;

interface ChavePageProps {
  params: Promise<{ chave: string }>;
}

export async function generateStaticParams() {
  const params: { chave: string }[] = [];

  for (const item of encomendas) {
    params.push({ chave: item.id });
    params.push({ chave: `nf${codigoNotaFiscal(item.nf)}` });
  }

  return params;
}

export default async function Ssw100EncomendaChavePage({ params }: ChavePageProps) {
  const { chave } = await params;
  const encomenda = buscarEncomendaPorChave(encomendas, chave);

  if (!encomenda) {
    notFound();
  }

  return <EncomendaDetalheView encomenda={encomenda} />;
}