import { Body, Controller, Get, Header, Param } from '@nestjs/common';
import { GetOrderUseCase } from '../../use-case/get-order.use-case';
import { GetTrackingUseCase } from './use-case/get-tracking.use-case';
import type { PortalCredentials } from '../../../../shared/ports/portal-auth.port';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly getTrackingUseCase: GetTrackingUseCase,
  ) {}

  @Get('/100')
  @Header('Content-Type', 'text/html; charset=utf-8')
  findAll(@Body() credentials: PortalCredentials): Promise<string> {
    return this.getTrackingUseCase.execute(credentials);
  }
}
