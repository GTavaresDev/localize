import { Controller, Get, Param } from '@nestjs/common';
import { GetOrderUseCase } from './use-case/get-order.use-case';
import { GetAllOrdersUseCase } from './use-case/get-all-orders.use-case';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly getAllOrdersUseCase: GetAllOrdersUseCase,
  ) {}

  @Get()
  findAll(): string {
    return this.getAllOrdersUseCase.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return this.getOrderUseCase.execute(id);
  }
}
