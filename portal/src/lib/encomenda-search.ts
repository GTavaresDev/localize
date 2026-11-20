import type { Encomenda } from "@/_data/encomendas";
import {
  bateDocumento,
  bateNotaFiscal,
  codigoNotaFiscal,
  normalizarTermoNotaFiscal,
  normalizarTexto,
} from "@/lib/search-utils";

export type SearchParamsRecord = Record<string, string | string[] | undefined>;

export function getSearchParam(param: string | string[] | undefined): string | undefined {
  if (Array.isArray(param)) return param[0];
  return param;
}

export interface EncomendaSearchFilters {
  q?: string;
  codigo?: string;
  nf?: string;
  cpf?: string;
  cpfRemetente?: string;
  cpfDestinatario?: string;
}

export function parseEncomendaSearchParams(params: SearchParamsRecord): EncomendaSearchFilters {
  return {
    q: getSearchParam(params.q),
    codigo: getSearchParam(params.codigo) || getSearchParam(params.id),
    nf: normalizarTermoNotaFiscal(
      getSearchParam(params.nf) ||
        getSearchParam(params.nota) ||
        getSearchParam(params.nota_fiscal)
    ) || undefined,
    cpf: getSearchParam(params.cpf) || getSearchParam(params.documento),
    cpfRemetente:
      getSearchParam(params.cpf_remetente) ||
      getSearchParam(params.remetente) ||
      getSearchParam(params.remetente_cpf),
    cpfDestinatario:
      getSearchParam(params.cpf_destinatario) ||
      getSearchParam(params.destinatario) ||
      getSearchParam(params.destinatario_cpf),
  };
}

export function hasEncomendaSearchFilters(filters: EncomendaSearchFilters): boolean {
  return Boolean(
    filters.q ||
      filters.codigo ||
      filters.nf ||
      filters.cpf ||
      filters.cpfRemetente ||
      filters.cpfDestinatario
  );
}

export function hasCpfListagemFilters(filters: EncomendaSearchFilters): boolean {
  return Boolean(filters.cpf || filters.cpfRemetente || filters.cpfDestinatario);
}

export function filtrarEncomendasPorCpf(
  items: Encomenda[],
  filters: EncomendaSearchFilters
): Encomenda[] {
  return filtrarEncomendas(items, {
    cpf: filters.cpf,
    cpfRemetente: filters.cpfRemetente,
    cpfDestinatario: filters.cpfDestinatario,
  });
}

export type Ssw100PathChave =
  | { tipo: "codigo"; valor: string }
  | { tipo: "nf"; valor: string };

export function parseSsw100PathChave(chave: string): Ssw100PathChave | null {
  const trimmed = chave.trim();
  if (!trimmed) return null;

  if (/^nf/i.test(trimmed)) {
    const codigoNf = normalizarTermoNotaFiscal(trimmed);
    if (!codigoNf) return null;
    return { tipo: "nf", valor: codigoNf };
  }

  return { tipo: "codigo", valor: trimmed };
}

export function buscarEncomendaPorChave(
  items: Encomenda[],
  chave: string
): Encomenda | undefined {
  const parsed = parseSsw100PathChave(chave);
  if (!parsed) return undefined;

  if (parsed.tipo === "codigo") {
    return items.find((item) => item.id.toLowerCase() === parsed.valor.toLowerCase());
  }

  return items.find((item) => codigoNotaFiscal(item.nf) === parsed.valor);
}

export function filtrarEncomendas(items: Encomenda[], filters: EncomendaSearchFilters): Encomenda[] {
  return items.filter((item) => {
    if (filters.codigo) {
      const codigoBuscado = normalizarTexto(filters.codigo);
      if (!normalizarTexto(item.id).includes(codigoBuscado)) return false;
    }

    if (filters.nf) {
      if (!bateNotaFiscal(item.nf, filters.nf)) return false;
    }

    if (filters.cpf) {
      const matchRem = bateDocumento(item.remetente.documento, filters.cpf);
      const matchDest = bateDocumento(item.destinatario.documento, filters.cpf);
      if (!matchRem && !matchDest) return false;
    }

    if (filters.cpfRemetente) {
      if (!bateDocumento(item.remetente.documento, filters.cpfRemetente)) return false;
    }

    if (filters.cpfDestinatario) {
      if (!bateDocumento(item.destinatario.documento, filters.cpfDestinatario)) return false;
    }

    if (filters.q) {
      const matchCodigo = normalizarTexto(item.id).includes(normalizarTexto(filters.q));
      const matchNf = bateNotaFiscal(item.nf, filters.q);
      const matchRemCpf = bateDocumento(item.remetente.documento, filters.q);
      const matchDestCpf = bateDocumento(item.destinatario.documento, filters.q);

      if (!matchCodigo && !matchNf && !matchRemCpf && !matchDestCpf) {
        return false;
      }
    }

    return true;
  });
}

export function searchParamsToQueryString(params: SearchParamsRecord): string {
  const urlParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const entry of value) {
        urlParams.append(key, entry);
      }
    } else {
      urlParams.set(key, value);
    }
  }

  return urlParams.toString();
}