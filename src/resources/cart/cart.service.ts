import { DatabaseService } from '@/database/database.service';
import { IRes } from '@/interfaces';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CartItem, Product, ShoppingSession } from '@prisma/client';
import { AddToCartDto, RemoveFromCartDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly db: DatabaseService) {}

  // find cart of user
  async findShoppingSession(
    userId: string
  ): Promise<IRes<Pick<ShoppingSession, 'id' | 'total'>>> {
    const shoppingSessionId = await this.getShoppingSessionId(userId);
    const shoppingSession = await this.getShoppingSessionDetails(
      shoppingSessionId
    );
    return {
      code: 'SUCCESS',
      message: 'successfully found shopping session',
      data: shoppingSession,
    };
  }

  // add product to cart
  async addToCart(
    userId: string,
    addToCartDto: AddToCartDto
  ): Promise<IRes<Pick<ShoppingSession, 'id' | 'total'>>> {
    // search for existing session
    const shoppingSessionId = await this.getShoppingSessionId(userId);
    // check for product
    const fProduct = await this.getProductDetails(addToCartDto.product_id);
    // add to cart
    await this.upsertCartItem(shoppingSessionId, addToCartDto);
    // update price
    await this.updateTotalPrice(
      shoppingSessionId,
      fProduct.price * addToCartDto.quantity,
      'INCREASE'
    );
    // get current cart details
    const shoppingSessionDetails = await this.getShoppingSessionDetails(
      shoppingSessionId
    );
    // send response
    return {
      code: 'SUCCESS',
      message: 'successfully added to your cart',
      data: shoppingSessionDetails,
    };
  }
  // remove product from cart
  async removeFromCart(
    userId: string,
    removeFromCartDto: RemoveFromCartDto
  ): Promise<IRes<Pick<ShoppingSession, 'id' | 'total'>>> {
    // search for existing session
    const shoppingSessionId = await this.getShoppingSessionId(userId);
    // check for product
    const fProduct = await this.getProductDetails(removeFromCartDto.product_id);
    // get the cart item
    const fCartItem = await this.getCartItemDetails(
      shoppingSessionId,
      removeFromCartDto.product_id
    );
    // remove from cart
    await this.removeCartItem(fCartItem, removeFromCartDto);
    // update total price
    const rQuantity = Math.min(fCartItem.quantity, removeFromCartDto.quantity);
    await this.updateTotalPrice(
      shoppingSessionId,
      rQuantity * fProduct.price,
      'DECREASE'
    );
    // get current cart details
    const shoppingSessionDetails = await this.getShoppingSessionDetails(
      shoppingSessionId
    );
    // send response
    return {
      code: 'SUCCESS',
      message: 'successfully removed from your cart',
      data: shoppingSessionDetails,
    };
  }

  // helper functions

  private upsertCartItem(
    shoppingSessionId: string,
    addToCartDto: AddToCartDto
  ): Promise<CartItem> {
    return this.db.cartItem.upsert({
      where: {
        shopping_session_id_product_id: {
          shopping_session_id: shoppingSessionId,
          product_id: addToCartDto.product_id,
        },
      },
      create: {
        shopping_session_id: shoppingSessionId,
        product_id: addToCartDto.product_id,
        quantity: addToCartDto.quantity,
      },
      update: {
        quantity: {
          increment: addToCartDto.quantity,
        },
      },
    });
  }

  private removeCartItem(
    cartItem: CartItem,
    removeFromCartDto: RemoveFromCartDto
  ) {
    if (cartItem.quantity - removeFromCartDto.quantity >= 1) {
      // decrease the quantity
      return this.db.cartItem.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity: {
            decrement: removeFromCartDto.quantity,
          },
        },
      });
    } else {
      // delete the cart item
      return this.db.cartItem.delete({
        where: {
          id: cartItem.id,
        },
      });
    }
  }

  private updateTotalPrice(
    shoppingSessionId: string,
    price: number,
    mode: 'INCREASE' | 'DECREASE'
  ) {
    return mode === 'INCREASE'
      ? this.db.shoppingSession.update({
          where: {
            id: shoppingSessionId,
          },
          data: {
            total: {
              increment: price,
            },
          },
        })
      : this.db.shoppingSession.update({
          where: {
            id: shoppingSessionId,
          },
          data: {
            total: {
              decrement: price,
            },
          },
        });
  }

  // utility functions

  private async getShoppingSessionId(userId: string): Promise<string> {
    const hasShoppingSession = await this.db.user
      .findUnique({
        where: {
          id: userId,
        },
      })
      .ShoppingSession();
    if (!hasShoppingSession) {
      const shoppingSession = await this.db.shoppingSession.create({
        data: {
          user_id: userId,
        },
      });
      return shoppingSession.id;
    }
    return hasShoppingSession.id;
  }

  private async getShoppingSessionDetails(
    shoppingSessionId: string
  ): Promise<Pick<ShoppingSession, 'id' | 'total'> | never> {
    const fShoppingSession = await this.db.shoppingSession.findUnique({
      where: {
        id: shoppingSessionId,
      },
      select: {
        id: true,
        total: true,
        CartItem: {
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
      },
    });
    if (!fShoppingSession)
      throw new NotFoundException('shopping session not found');
    return fShoppingSession;
  }

  private async getProductDetails(productId: string): Promise<Product | never> {
    const fProduct = await this.db.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!fProduct) throw new NotFoundException('product not found');
    return fProduct;
  }

  private async getCartItemDetails(
    shoppingSessionId: string,
    productId: string
  ): Promise<CartItem | never> {
    const fCartItem = await this.db.cartItem.findUnique({
      where: {
        shopping_session_id_product_id: {
          shopping_session_id: shoppingSessionId,
          product_id: productId,
        },
      },
    });
    if (!fCartItem) throw new NotFoundException('cart item not found');
    return fCartItem;
  }
}
