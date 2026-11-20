import { redirect } from "next/navigation";
import { encomendas } from "@/_data/encomendas";

export const instant = false;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  return encomendas.map((e) => ({
    id: e.id,
  }));
}

export default async function EncomendaLegacyRedirectPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/ssw/100/${id}`);
}