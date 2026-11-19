export const PORTAL_AUTH = Symbol('PORTAL_AUTH');

export interface PortalCredentials {
  company: string;
  usuario?: string;
  username?: string;
  cpf: string;
  senha?: string;
  password?: string;
}

export interface PortalSession {
  token: string;
  cookies: string;
}

export interface PortalAuthPort {
  login(credentials: PortalCredentials): Promise<PortalSession>;
}
