import type { PortalSession } from './portal-auth.port';

export const EXTERNAL_PAGE = Symbol('EXTERNAL_PAGE');

export interface ExternalPagePort {
  fetchPage(session?: PortalSession, nf?: string | number): Promise<string>;
}
