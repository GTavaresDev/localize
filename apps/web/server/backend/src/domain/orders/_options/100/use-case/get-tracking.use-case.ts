import { Inject, Injectable } from '@nestjs/common';
import {
  PORTAL_AUTH,
  type PortalAuthPort,
  type PortalCredentials,
} from '../../../../../shared/ports/portal-auth.port';
import {
  EXTERNAL_PAGE,
  type ExternalPagePort,
} from '../../../../../shared/ports/external-page.port';
import { Get100Option } from '../../get-option-100.gateway';

@Injectable()
export class GetTrackingUseCase {
  constructor(
    @Inject(PORTAL_AUTH) private readonly portalAuth: PortalAuthPort,
    @Inject(EXTERNAL_PAGE) private readonly option100Page: Get100Option,
  ) {}

  async execute(credentials: PortalCredentials): Promise<string> {
    const session = await this.portalAuth.login(credentials);
    console.log('session:', session);

    const page = await this.option100Page.fetchPage(session);
    return page;
  }
}
