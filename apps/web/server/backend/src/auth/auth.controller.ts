import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @HttpCode(200)
  @Post('token')
  token(@Body() body: { clientId: string; clientSecret: string }) {
    return this.auth.issueToken(body.clientId, body.clientSecret);
  }
}
