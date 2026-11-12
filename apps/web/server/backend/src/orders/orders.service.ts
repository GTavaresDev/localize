import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  getOrder(): string {
    return 'Pedido';
  }
}
