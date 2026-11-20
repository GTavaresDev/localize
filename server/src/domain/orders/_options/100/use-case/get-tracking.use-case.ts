import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  PORTAL_AUTH,
  type PortalAuthPort,
  type PortalCredentials,
  type PortalSession,
} from '../../../../../shared/ports/portal-auth.port';
import {
  EXTERNAL_PAGE,
  type ExternalPagePort,
} from '../../../../../shared/ports/external-page.port';
import { Get100Option } from '../get-option-100.gateway';
import { parseTrackingHtml, TrackingItem } from '../parser/tracking-parser';

@Injectable()
export class GetTrackingUseCase {
  constructor(
    @Inject(PORTAL_AUTH) private readonly portalAuth: PortalAuthPort,
    @Inject(EXTERNAL_PAGE) private readonly externalPage: Get100Option,
  ) {}
  private async resolveSession(
    credentials?: PortalCredentials,
    cookies?: string,
  ): Promise<PortalSession> {
    if (cookies) return { token: '', cookies };
    if (credentials) return this.portalAuth.login(credentials);
    throw new UnauthorizedException('Credenciais ou cookies são obrigatórios');
  }
  async execute(
    credentials?: PortalCredentials,
    cookies?: string,
  ): Promise<TrackingItem[]> {
    const session = await this.resolveSession(credentials, cookies);
    const page = await this.externalPage.fetchPage(session);
    return parseTrackingHtml(page);
  }
}
