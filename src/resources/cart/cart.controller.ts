import { User } from '@/decorators';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards';
import { CartService } from './cart.service';
import { AddToCartDto, RemoveFromCartDto } from './dto/cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  findShoppingSession(@User('userId') userId: string) {
    return this.cartService.findShoppingSession(userId);
  }

  @Post('add')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  addToCard(
    @User('userId') userId: string,
    @Body() addToCartDto: AddToCartDto
  ) {
    return this.cartService.addToCart(userId, addToCartDto);
  }

  @Post('remove')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  removeFromCart(
    @User('userId') userId: string,
    @Body() removeFromCartDto: RemoveFromCartDto
  ) {
    return this.cartService.removeFromCart(userId, removeFromCartDto);
  }
}
