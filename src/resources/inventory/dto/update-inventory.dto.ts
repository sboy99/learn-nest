import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateInventoryDto } from './create-inventory.dto';

export class UpdateInventoryDto extends PartialType(
  PickType(CreateInventoryDto, ['quantity'])
) {}
