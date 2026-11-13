import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { GetOrderUseCase } from './use-case/get-order.use-case';
import { GetAllOrdersUseCase } from './use-case/get-all-orders.use-case';

@Module({
  controllers: [OrdersController],
  providers: [GetOrderUseCase, GetAllOrdersUseCase],
})
export class OrdersModule {}
