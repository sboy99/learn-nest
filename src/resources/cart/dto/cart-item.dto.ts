import { CartItem } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class AddToCartDto implements Pick<CartItem, 'product_id' | 'quantity'> {
  @IsUUID()
  @IsNotEmpty()
  product_id: string;

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class RemoveFromCartDto extends AddToCartDto {}
