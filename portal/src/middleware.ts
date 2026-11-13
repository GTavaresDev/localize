import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas e arquivos públicos que não precisam de autenticação
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("auth_token")?.value;
  const isLoginPage = pathname === "/login";

  // Se o usuário não possui token e está tentando acessar qualquer rota protegida
  if (!token && !isLoginPage) {
    const loginUrl = new URL("/login", request.url);
    // Adiciona o parâmetro redirect para voltar à rota original se desejado
    if (pathname !== "/") {
      loginUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Se o usuário já possui token e tenta acessar a página de login
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas da aplicação,
     * exceto arquivos estáticos específicos do Next.js
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
