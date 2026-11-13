"use client";

import { LogOut } from "lucide-react";

export function LogoutButton({ className = "" }: { className?: string }) {
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`win95-btn px-2.5 py-1 text-xs font-bold text-black flex items-center gap-1.5 hover:bg-[#D4D0C8] cursor-pointer active:translate-px ${className}`}
      title="Encerrar sessão e sair"
    >
      <LogOut className="w-3.5 h-3.5 text-[#800000]" />
      <span>Sair</span>
    </button>
  );
}
