import { Injectable } from '@nestjs/common';

@Injectable()
export class GetAllOrdersUseCase {
  execute(): string {
    return 'Todos os pedidos';
  }
}
