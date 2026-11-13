"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";

const ROUTE_MAP: Record<string, string> = {
  "100": "/ssw/100",
  "101": "/ssw/101",
  "102": "/ssw/102",
};

export default function Home() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanValue = value.trim();

    if (ROUTE_MAP[cleanValue]) {
      setError("");
      router.push(ROUTE_MAP[cleanValue]);
    } else if (cleanValue === "") {
      setError("Digite um código de acesso.");
    } else {
      setError("Código inválido. Digite 100, 101 ou 102.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-6 selection:bg-[#000080] selection:text-white">
      <div className="relative z-10 w-full max-w-md win95-raised bg-[#C0C0C0] p-1">
        {/* Barra de título retrô decorativa */}
        <div
          className="win95-titlebar bg-[#000080] text-white px-2 py-1 flex items-center justify-between mb-1"
        >
          <span className="text-xs font-bold tracking-wide">
            Localize - Painel Principal
          </span>
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

        <div className="p-5 flex flex-col items-center text-center space-y-6 bg-[#C0C0C0]">
          <div className="space-y-3">
            <label
              htmlFor="accessCode"
              className="text-2xl font-bold tracking-tight text-black block"
            >
              Acesso <span className="text-[#000080]">Rápido</span>
            </label>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-black">
              <span className="px-2 py-0.5 win95-sunken bg-white text-black">
                <strong className="text-[#000080] font-mono">100</strong> - Rastreamento
              </span>
              <span className="px-2 py-0.5 win95-sunken bg-white text-black">
                <strong className="text-[#000080] font-mono">101</strong> - Coletas
              </span>
              <span className="px-2 py-0.5 win95-sunken bg-white text-black">
                <strong className="text-[#000080] font-mono">102</strong> - Cotação
              </span>
            </div>
          </div>

          <form onSubmit={handleSearch} className="w-full space-y-2">
            <div className="w-full flex items-center gap-2">
              <input
                id="accessCode"
                type="text"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Digite o código (100, 101 ou 102)..."
                className="flex-1 h-9 px-3 win95-sunken bg-white text-sm text-black placeholder:text-[#808080] outline-none focus:outline-1 focus:outline-dotted focus:outline-black"
              />
              <Button
                type="submit"
                className="bg-[#000080] hover:bg-[#0000A8] text-white font-bold h-9 px-5 gap-2 cursor-pointer rounded-none border-t-2 border-l-2 border-[#6B8BFF] border-r-2 border-b-2 border-[#000040] active:translate-px"
              >
                <Search className="w-4 h-4" />
                <span>Buscar</span>
              </Button>
            </div>

            {error && (
              <p className="text-xs text-[#800000] font-bold text-left px-1">{error}</p>
            )}
          </form>

          {/* Rodapé com Logout */}
          <div className="w-full pt-3 border-t-2 border-[#808080] flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#404040] font-mono">
              Sessão autenticada
            </span>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
