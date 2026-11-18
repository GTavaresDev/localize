import { Injectable } from '@nestjs/common';

@Injectable()
export class GetOrderUseCase {
  execute(id: string): string {
    return `Pedido ${id}`;
  }
}
