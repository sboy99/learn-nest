import { ProductInventory } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateInventoryDto
  implements Pick<ProductInventory, 'product_id' | 'quantity'>
{
  @IsUUID('4')
  @IsNotEmpty()
  product_id: string;

  @Min(1)
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
