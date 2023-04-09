import { UtilityService } from '@/helpers/utility/utility.service';
import { Module } from '@nestjs/common';
import { InventoryService } from '../inventory/inventory.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, InventoryService, UtilityService],
})
export class ProductModule {}
