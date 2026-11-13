// Utilitário para limpar e normalizar strings de busca (remove pontuação de CPF/CNPJ/códigos)
export function normalizarTexto(valor?: string | null): string {
  if (!valor) return "";
  return valor.toLowerCase().trim();
}

export function normalizarNumeros(valor?: string | null): string {
  if (!valor) return "";
  return valor.replace(/\D/g, "");
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
