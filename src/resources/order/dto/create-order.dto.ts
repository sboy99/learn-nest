import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  shoppingSessionId: string;

  @IsString()
  @IsNotEmpty()
  method: string;
}
