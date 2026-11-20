// Utilitário para limpar e normalizar strings de busca (remove pontuação de CPF/CNPJ/códigos)
export function normalizarTexto(valor?: string | null): string {
  if (!valor) return "";
  return valor.toLowerCase().trim();
}

export function normalizarNumeros(valor?: string | null): string {
  if (!valor) return "";
  return valor.replace(/\D/g, "");
}

/** Remove prefixo "NF-" e espaços; devolve só o que o usuário digitou para busca. */
export function normalizarTermoNotaFiscal(termo?: string | null): string {
  if (!termo) return "";
  return termo.trim().replace(/^nf[-\s]*/i, "");
}

/** Código numérico da NF para exibição (ex.: NF-0019283 → 0019283). */
export function codigoNotaFiscal(nf?: string | null): string {
  if (!nf) return "";
  const semPrefixo = nf.trim().replace(/^nf[-\s]*/i, "");
  const soDigitos = normalizarNumeros(semPrefixo);
  if (soDigitos.length > 0) return soDigitos;
  return semPrefixo;
}

export function bateNotaFiscal(nfItem?: string | null, termoBusca?: string | null): boolean {
  if (!nfItem || !termoBusca) return false;

  const termo = normalizarTermoNotaFiscal(termoBusca);
  const codigoBusca = normalizarNumeros(termo);
  const codigoItem = codigoNotaFiscal(nfItem);

  if (codigoBusca.length >= 1) {
    if (codigoItem === codigoBusca) return true;
    if (codigoBusca.length >= 2 && codigoItem.includes(codigoBusca)) return true;
  }

  const itemTexto = normalizarTexto(codigoNotaFiscal(nfItem));
  const buscaTexto = normalizarTexto(termo);
  return buscaTexto.length > 0 && itemTexto.includes(buscaTexto);
}

// Verifica se um termo de busca corresponde a um documento (CPF ou CNPJ)
export function bateDocumento(documentoAlvo?: string | null, termoBusca?: string | null): boolean {
  if (!documentoAlvo || !termoBusca) return false;
  
  const docLimpo = normalizarNumeros(documentoAlvo);
  const buscaLimpa = normalizarNumeros(termoBusca);

  if (buscaLimpa.length >= 3 && docLimpo.includes(buscaLimpa)) {
    return true;
  }

  return normalizarTexto(documentoAlvo).includes(normalizarTexto(termoBusca));
}
