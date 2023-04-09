import { Product, ProductInventory } from '@prisma/client';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto
  implements
    Pick<Product, 'name' | 'desc' | 'SKU' | 'price'>,
    Pick<ProductInventory, 'quantity'>
{
  @MinLength(5)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  desc: string;

  @IsString()
  @IsNotEmpty()
  SKU: string;

  // todo: add category support

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
