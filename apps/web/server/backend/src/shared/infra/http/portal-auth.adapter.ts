import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  PortalAuthPort,
  PortalCredentials,
  PortalSession,
} from '../../ports/portal-auth.port';

const PORTAL_BASE_URL =
  process.env.BASE_DE_DADOS || 'https://portal-by-gbtavares.vercel.app';

@Injectable()
export class PortalAuthAdapter implements PortalAuthPort {
  async login(credentials: PortalCredentials): Promise<PortalSession> {
    const usuario = credentials.usuario ?? credentials.username;
    const senha = credentials.senha ?? credentials.password;

    if (!credentials.company || !usuario || !credentials.cpf || !senha) {
      throw new HttpException(
        'company, usuario/username, cpf e senha/password são obrigatórios',
        HttpStatus.BAD_REQUEST,
      );
    }

    const res = await fetch(`${PORTAL_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company: credentials.company,
        usuario,
        cpf: credentials.cpf,
        senha,
      }),
    });

    if (!res.ok) {
      throw new HttpException('Portal login rejected', HttpStatus.UNAUTHORIZED);
    }

    const setCookies = res.headers.getSetCookie();

    // Mantém só o par "nome=valor" de cada cookie, sem atributos
    const cookies = setCookies
      .map((c) => c.split(';')[0].trim())
      .filter(Boolean)
      .join('; ');

    const token =
      cookies
        .split('; ')
        .find((c) => c.startsWith('auth_token='))
        ?.slice('auth_token='.length) ?? '';

    return { token, cookies };
  }
}
