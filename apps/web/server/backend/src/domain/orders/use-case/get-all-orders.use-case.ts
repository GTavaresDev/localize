import { Inject, Injectable } from '@nestjs/common';
import {
  PAGINA_EXTERNA,
  type PaginaExternaPort,
} from '../../../shared/ports/pagina-externa.port';

@Injectable()
export class GetAllOrdersUseCase {
  constructor(
    @Inject(PAGINA_EXTERNA) private readonly portal: PaginaExternaPort,
  ) {}

  execute(): Promise<string> {
    return this.portal.buscarHtml();
  }
}
