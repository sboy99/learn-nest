import { Module } from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PaymentService],
})
export class OrderModule {}
