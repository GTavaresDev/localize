export interface MockAccount {
  id: string;
  company: string; // Sigla, ex: "ABC", "LOC"
  usuario: string; // Nome de usuário, ex: "admin", "gabriel"
  cpf: string;     // CPF (apenas dígitos ou formatado)
  senha: string;   // Senha
  nomeCompleto: string;
}

export const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: "usr-01",
    company: "ABC",
    usuario: "admin",
    cpf: "12345678900",
    senha: "123",
    nomeCompleto: "Administrador ABC",
  },
  {
    id: "usr-02",
    company: "LOC",
    usuario: "gabriel",
    cpf: "98765432199",
    senha: "123",
    nomeCompleto: "Gabriel Tavares",
  },
  {
    id: "usr-03",
    company: "XPTO",
    usuario: "operador",
    cpf: "11122233344",
    senha: "password",
    nomeCompleto: "Operador Logística",
  },
];

/**
 * Remove qualquer caractere não numérico do CPF para comparação confiável
 */
function cleanCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

/**
 * Normaliza e compara credenciais contra o "banco fake"
 */
export function authenticateMockUser(
  company: string,
  usuario: string,
  cpf: string,
  senha: string
): MockAccount | null {
  const normCompany = company.trim().toUpperCase();
  const normUsuario = usuario.trim().toLowerCase();
  const normCpf = cleanCpf(cpf);
  const normSenha = senha.trim();

  const found = MOCK_ACCOUNTS.find(
    (acc) =>
      acc.company.toUpperCase() === normCompany &&
      acc.usuario.toLowerCase() === normUsuario &&
      cleanCpf(acc.cpf) === normCpf &&
      acc.senha === normSenha
  );

  return found || null;
}
