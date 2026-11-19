import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ExternalPagePort } from '../../../shared/ports/external-page.port';
import type { PortalSession } from '../../../shared/ports/portal-auth.port';

const PORTAL_BASE_URL =
  process.env.BASE_DE_DADOS || 'https://portal-by-gbtavares.vercel.app';

@Injectable()
export class Get100Option implements ExternalPagePort {
  async fetchPage(session?: PortalSession): Promise<string> {
    const cookieHeader = session?.cookies
      ? session.cookies
      : session?.token
        ? `auth_token=${session.token}`
        : '';

    const res = await fetch(`${PORTAL_BASE_URL}/ssw/100`, {
      method: 'GET',
      headers: cookieHeader ? { Cookie: cookieHeader } : {},
    });

    if (!res.ok) {
      throw new HttpException(
        `Failed to fetch option 100 page: ${res.status}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    return res.text();
  }
}
