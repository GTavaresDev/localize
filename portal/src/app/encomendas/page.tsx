import { redirect } from "next/navigation";
import { encomendas } from "@/_data/encomendas";
import {
  filtrarEncomendas,
  hasEncomendaSearchFilters,
  parseEncomendaSearchParams,
  searchParamsToQueryString,
  type SearchParamsRecord,
} from "@/lib/encomenda-search";

export const instant = false;

interface EncomendasPageProps {
  searchParams: Promise<SearchParamsRecord>;
}

export default async function EncomendasRedirectPage({ searchParams }: EncomendasPageProps) {
  const resolvedParams = await searchParams;
  const filters = parseEncomendaSearchParams(resolvedParams);

  if (hasEncomendaSearchFilters(filters)) {
    const matches = filtrarEncomendas(encomendas, filters);

    if (matches.length === 1) {
      redirect(`/encomendas/${matches[0].id}`);
    }
  }

  const query = searchParamsToQueryString(resolvedParams);
  redirect(query ? `/ssw/100?${query}` : "/ssw/100");
}