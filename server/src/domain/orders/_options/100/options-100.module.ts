import { Module } from '@nestjs/common';
import { OrdersController } from './options-100.controller';
import { GetOrderUseCase } from '../../use-case/get-order.use-case';
import { GetTrackingUseCase } from './use-case/get-tracking.use-case';
import { PORTAL_AUTH } from '../../../../shared/ports/portal-auth.port';
import { PortalAuthAdapter } from '../../../../shared/infra/http/portal-auth.adapter';
import { EXTERNAL_PAGE } from '../../../../shared/ports/external-page.port';
import { ExternalPageAdapter } from '../../../../shared/infra/http/external-page.adapter';

@Module({
  controllers: [OrdersController],
  providers: [
    GetOrderUseCase,
    GetTrackingUseCase,
    { provide: PORTAL_AUTH, useClass: PortalAuthAdapter },
    { provide: EXTERNAL_PAGE, useClass: ExternalPageAdapter },
  ],
})
export class OrdersModule {}
