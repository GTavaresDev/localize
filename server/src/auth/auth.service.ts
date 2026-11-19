import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async issueToken(clientId: string, clientSecret: string) {
    const expectedId = this.config.getOrThrow<string>('CLIENT_ID');
    const hash = this.config.getOrThrow<string>('CLIENT_SECRET_HASH');

    const valid =
      clientId === expectedId && (await bcrypt.compare(clientSecret, hash));
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    return { access_token: await this.jwt.signAsync({ sub: clientId }) };
  }
}
