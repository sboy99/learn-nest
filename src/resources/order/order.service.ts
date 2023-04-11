import { DatabaseService } from '@/database/database.service';
import { IRes } from '@/interfaces';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CartItem, OrderDetails } from '@prisma/client';
import { PaymentService } from '../payment/payment.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly db: DatabaseService,
    private readonly payment: PaymentService
  ) {}

  async create(
    userId: string,
    createOrderDto: CreateOrderDto
  ): Promise<IRes<Pick<OrderDetails, 'id' | 'total' | 'created_at'>>> {
    // get all cart items
    const shoppingSession = await this.getShoppingSessionDetails(
      userId,
      createOrderDto.shoppingSessionId
    );

    if (shoppingSession.total <= 0 || !shoppingSession?.CartItem?.length) {
      throw new NotAcceptableException(`order items cannot be empty`);
    }

    // create payment
    const payment = await this.payment.createPayment({
      amount: shoppingSession.total,
      provider: createOrderDto.method,
    });
    // order details
    const orderDetails = await this.db.orderDetails.create({
      data: {
        user_id: userId,
        total: shoppingSession.total,
        payment_id: payment.id,
      },
    });
    // create order items
    await this.createOrderItems(orderDetails.id, shoppingSession.CartItem);
    // reset shopping session
    await this.resetShoppingSession(shoppingSession.id);
    // get order details
    const fOrderDetails = await this.getOrderDetails(userId, orderDetails.id);
    return {
      code: 'SUCCESS',
      message: 'successfully created order',
      data: fOrderDetails,
    };
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  // helper methods
  private async createOrderItems(
    orderId: string,
    cartItems: Pick<CartItem, 'id' | 'product_id' | 'quantity'>[]
  ) {
    for (const cartItem of cartItems) {
      await this.createOrderItem(orderId, cartItem);
      await this.removeCartItem(cartItem.id);
    }
  }

  private resetShoppingSession(shoppingSessionId: string) {
    return this.db.shoppingSession.update({
      where: {
        id: shoppingSessionId,
      },
      data: {
        total: 0,
      },
    });
  }

  // utility methods
  private getShoppingSessionDetails(userId: string, shoppingSessionId: string) {
    return this.db.shoppingSession.findFirst({
      where: {
        id: shoppingSessionId,
        user_id: userId,
      },
      select: {
        id: true,
        total: true,
        CartItem: {
          select: {
            id: true,
            product_id: true,
            quantity: true,
            created_at: true,
          },
        },
      },
    });
  }

  private createOrderItem(
    orderId: string,
    cartItem: Pick<CartItem, 'product_id' | 'quantity'>
  ) {
    return this.db.orderItem.create({
      data: {
        order_id: orderId,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
      },
    });
  }

  private removeCartItem(cartItemId: string) {
    return this.db.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });
  }

  private getOrderDetails(userId: string, orderId: string) {
    return this.db.orderDetails.findFirst({
      where: {
        id: orderId,
        user_id: userId,
      },
      select: {
        id: true,
        total: true,
        OrderItem: {
          select: {
            quantity: true,
            Product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
        PaymentDetails: {
          select: {
            id: true,
            amount: true,
            status: true,
            payment_intent_id: true,
          },
        },
        created_at: true,
      },
    });
  }
}
