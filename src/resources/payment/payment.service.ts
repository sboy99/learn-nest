import { DatabaseService } from '@/database/database.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Stripe } from 'stripe';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  private stripe: InstanceType<typeof Stripe>;
  constructor(config: ConfigService, private readonly db: DatabaseService) {
    this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
      typescript: true,
      protocol: 'https',
    });
  }
  async createPayment(createPaymentDto: CreatePaymentDto) {
    const paymentIntent = await this.getPaymentIntent({
      amount: createPaymentDto.amount,
      currency: 'inr',
    });
    return this.db.paymentDetails.create({
      data: {
        amount: createPaymentDto.amount,
        provider: createPaymentDto.provider,
        payment_intent_id: paymentIntent.client_secret,
      },
    });
  }

  private getPaymentIntent(payload: {
    amount: number;
    currency: 'inr' | 'usd';
  }) {
    return this.stripe.paymentIntents.create({
      amount: payload.amount * 100,
      currency: payload.currency,
      capture_method: 'automatic',
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }
}
