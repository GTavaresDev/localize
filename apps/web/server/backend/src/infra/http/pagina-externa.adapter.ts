import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PaginaExternaPort } from '../../shared/ports/pagina-externa.port';

@Injectable()
export class PaginaExternaAdapter implements PaginaExternaPort {
  async buscarHtml(): Promise<string> {
    const url = process.env.BASE_DE_DADOS;

    if (!url) {
      throw new Error('BASE_DE_DADOS não definida');
    }

    const res = await fetch(url);

    if (!res.ok) {
      throw new HttpException(
        `Falha ao buscar ${url}: ${res.status}`,
        HttpStatus.BAD_GATEWAY,
      );
    }

    return res.text();
  }
}
