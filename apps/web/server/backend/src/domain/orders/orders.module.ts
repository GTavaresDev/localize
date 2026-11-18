import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { GetOrderUseCase } from './use-case/get-order.use-case';
import { GetAllOrdersUseCase } from './use-case/get-all-orders.use-case';
import { PAGINA_EXTERNA } from '../../shared/ports/pagina-externa.port';
import { PaginaExternaAdapter } from '../../infra/http/pagina-externa.adapter';

@Module({
  controllers: [OrdersController],
  providers: [
    GetOrderUseCase,
    GetAllOrdersUseCase,
    { provide: PAGINA_EXTERNA, useClass: PaginaExternaAdapter },
  ],
})
export class OrdersModule {}
