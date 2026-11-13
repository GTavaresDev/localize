import { NextRequest, NextResponse } from "next/server";
import { authenticateMockUser } from "@/_data/auth-mock";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, usuario, cpf, senha } = body || {};

    if (!company || !usuario || !cpf || !senha) {
      return NextResponse.json(
        {
          ok: false,
          error: "Todos os campos (Company, Usuário, CPF e Senha) são obrigatórios.",
        },
        { status: 400 }
      );
    }

    const user = authenticateMockUser(company, usuario, cpf, senha);

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Credenciais inválidas. Verifique a sigla da empresa, usuário, CPF e senha informados.",
        },
        { status: 401 }
      );
    }

    // Gera um token baseado nos dados do usuário e timestamp
    const tokenPayload = {
      uid: user.id,
      company: user.company,
      user: user.usuario,
      name: user.nomeCompleto,
      iat: Date.now(),
    };
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString("base64");

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        company: user.company,
        usuario: user.usuario,
        nomeCompleto: user.nomeCompleto,
      },
    });

    // Grava o token nos cookies do navegador
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 horas
    });

    return response;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Erro ao processar a requisição de login." },
      { status: 500 }
    );
  }
}
