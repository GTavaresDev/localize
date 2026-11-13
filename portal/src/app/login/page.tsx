"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, ShieldAlert, Building2, User, CreditCard, Lock } from "lucide-react";
import { MOCK_ACCOUNTS } from "@/_data/auth-mock";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("from") || "/";

  const [company, setCompany] = useState("");
  const [usuario, setUsuario] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!company.trim() || !usuario.trim() || !cpf.trim() || !senha.trim()) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, usuario, cpf, senha }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setError(data.error || "Falha na autenticação.");
        setLoading(false);
        return;
      }

      // Redireciona para o destino pretendido
      router.push(redirectTarget);
      router.refresh();
    } catch {
      setError("Erro de comunicação com o servidor. Tente novamente.");
      setLoading(false);
    }
  };

  const handleFillDemo = (acc: typeof MOCK_ACCOUNTS[0]) => {
    setCompany(acc.company);
    setUsuario(acc.usuario);
    setCpf(acc.cpf);
    setSenha(acc.senha);
    setError("");
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-4 sm:p-6 selection:bg-[#000080] selection:text-white">
      <div className="relative z-10 w-full max-w-3xl win95-raised bg-[#C0C0C0] p-1">
        {/* Barra de título retrô */}
        <div
          aria-hidden="true"
          className="win95-titlebar bg-[#000080] text-white px-3 py-1.5 flex items-center justify-between mb-1"
        >
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-white" />
            <span className="text-xs font-bold tracking-wide">
              Controle de Acesso - Autenticação de Usuário
            </span>
          </div>
          <div className="flex items-center gap-1">
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
        </div>

        {/* Conteúdo da janela */}
        <div className="p-4 sm:p-6 space-y-5 bg-[#C0C0C0]">
          <div className="border-b-2 border-[#808080] pb-3">
            <h1 className="text-xl font-bold tracking-tight text-black">
              Identificação no <span className="text-[#000080]">Sistema</span>
            </h1>
            <p className="text-xs text-[#404040] mt-1">
              Informe a sigla da sua empresa, credenciais de usuário e CPF cadastrados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-5 items-stretch">
            {/* Coluna Esquerda: Formulário de Login */}
            <form onSubmit={handleSubmit} className="flex flex-col justify-between space-y-3.5">
              <div className="space-y-3">
                {/* Campo: Company (Sigla) */}
                <div className="space-y-1">
                  <label
                    htmlFor="company"
                    className="text-xs font-bold text-black flex items-center gap-1.5"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#000080]" />
                    Company (Sigla da Empresa):
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value.toUpperCase())}
                    placeholder="Ex: ABC"
                    disabled={loading}
                    className="w-full h-8 px-2.5 win95-sunken bg-white text-xs text-black placeholder:text-[#808080] outline-none focus:outline-1 focus:outline-dotted focus:outline-black uppercase font-bold"
                  />
                </div>

                {/* Campo: Usuário */}
                <div className="space-y-1">
                  <label
                    htmlFor="usuario"
                    className="text-xs font-bold text-black flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-[#000080]" />
                    Usuário:
                  </label>
                  <input
                    id="usuario"
                    type="text"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="Ex: admin"
                    disabled={loading}
                    className="w-full h-8 px-2.5 win95-sunken bg-white text-xs text-black placeholder:text-[#808080] outline-none focus:outline-1 focus:outline-dotted focus:outline-black"
                  />
                </div>

                {/* Campo: CPF */}
                <div className="space-y-1">
                  <label
                    htmlFor="cpf"
                    className="text-xs font-bold text-black flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-[#000080]" />
                    CPF:
                  </label>
                  <input
                    id="cpf"
                    type="text"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="000.000.000-00 ou apenas números"
                    disabled={loading}
                    className="w-full h-8 px-2.5 win95-sunken bg-white text-xs text-black placeholder:text-[#808080] outline-none focus:outline-1 focus:outline-dotted focus:outline-black font-mono"
                  />
                </div>

                {/* Campo: Senha */}
                <div className="space-y-1">
                  <label
                    htmlFor="senha"
                    className="text-xs font-bold text-black flex items-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#000080]" />
                    Senha:
                  </label>
                  <input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••"
                    disabled={loading}
                    className="w-full h-8 px-2.5 win95-sunken bg-white text-xs text-black placeholder:text-[#808080] outline-none focus:outline-1 focus:outline-dotted focus:outline-black"
                  />
                </div>

                {/* Mensagem de Erro */}
                {error && (
                  <div className="p-2 win95-sunken bg-[#FFEFEF] border border-[#800000] flex items-start gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#800000] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#800000] font-bold leading-tight">{error}</p>
                  </div>
                )}
              </div>

              {/* Botão de Envio */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#000080] hover:bg-[#0000A8] text-white text-xs font-bold px-4 py-2 border-t-2 border-l-2 border-[#6B8BFF] border-r-2 border-b-2 border-[#000040] active:translate-px cursor-pointer disabled:opacity-60"
                >
                  {loading ? "Autenticando..." : "Entrar no Sistema"}
                </button>
              </div>
            </form>

            {/* Coluna Direita: Contas do Banco Fake */}
            <div className="win95-raised p-3 bg-[#C0C0C0] flex flex-col justify-between">
              <div>
                <div className="border-b border-[#808080] pb-1.5 mb-2.5">
                  <span className="text-[11px] font-bold text-[#000080] block uppercase tracking-wide">
                    Contas no Banco Fake:
                  </span>
                  <p className="text-[10px] text-[#404040]">
                    Clique para preencher automaticamente:
                  </p>
                </div>

                <div className="space-y-2">
                  {MOCK_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleFillDemo(acc)}
                      className="w-full text-left p-2 win95-sunken bg-white hover:bg-[#F0F4FF] text-black transition-colors flex flex-col gap-0.5 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between border-b border-[#ECECEC] pb-1">
                        <span className="text-xs font-bold text-[#000080]">
                          {acc.company} ({acc.nomeCompleto})
                        </span>
                        <span className="text-[10px] text-[#000080] font-bold underline hover:text-[#0000A8]">
                          Usar
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#404040] pt-0.5">
                        <span>
                          User: <strong className="text-black">{acc.usuario}</strong>
                        </span>
                        <span>
                          Senha: <strong className="font-mono text-black">{acc.senha}</strong>
                        </span>
                      </div>
                      <div className="text-[10px] text-[#505050] font-mono">
                        CPF: {acc.cpf}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-[#A0A0A0] text-[10px] text-[#505050]">
                * Dados mockados para validação das rotas protegidas.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white text-black flex items-center justify-center p-4">
          <div className="win95-raised bg-[#C0C0C0] p-4 text-xs font-bold">
            Carregando sistema de identificação...
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
