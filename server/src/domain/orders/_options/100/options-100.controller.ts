import { Body, Controller, Get, Headers, Param } from '@nestjs/common';
import { GetTrackingByIdUseCase } from './use-case/get-order.use-case';
import { GetTrackingUseCase } from './use-case/get-tracking.use-case';
import type { PortalCredentials } from '../../../../shared/ports/portal-auth.port';
import { TrackingItem } from './parser/tracking-parser';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly getTrackingByIdUseCase: GetTrackingByIdUseCase,
    private readonly getTrackingUseCase: GetTrackingUseCase,
  ) {}

  @Get('/100')
  findAll(
    @Headers('cookie') cookies?: string,
    @Body() credentials?: PortalCredentials,
  ): Promise<TrackingItem[]> {
    return this.getTrackingUseCase.execute(credentials, cookies);
  }

  @Get('/100/:code')
  findOne(
    @Param('code') code: string,
    @Headers('cookie') cookies?: string,
    @Body() credentials?: PortalCredentials,
  ): Promise<TrackingItem[]> {
    return this.getTrackingByIdUseCase.execute(code, credentials, cookies);
  }
}
