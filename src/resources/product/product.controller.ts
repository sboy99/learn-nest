import { AllowedRoles } from '@/decorators';
import { UtilityService } from '@/helpers/utility/utility.service';
import { IRes } from '@/interfaces';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Product as TProduct } from '@prisma/client';
import { AccessTokenGuard, RolesGuard } from '../auth/guards';
import { UpdateInventoryDto } from '../inventory/dto/update-inventory.dto';
import { InventoryService } from '../inventory/inventory.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly inventoryService: InventoryService,
    private readonly utilityService: UtilityService
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @AllowedRoles('ADMIN')
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto
  ): Promise<IRes<TProduct>> {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<IRes<TProduct>> {
    this.utilityService.checkForValidUuid(id);
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @AllowedRoles('ADMIN')
  @UseGuards(AccessTokenGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    this.utilityService.checkForValidUuid(id);
    return this.productService.update(id, updateProductDto);
  }

  @Patch(':id/inventory')
  @AllowedRoles('ADMIN')
  @UseGuards(AccessTokenGuard, RolesGuard)
  updateStock(
    @Param('id') id: string,
    @Body() updateInventoryDto: UpdateInventoryDto
  ) {
    this.utilityService.checkForValidUuid(id, 'provide valid product id');
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Delete(':id')
  @AllowedRoles('ADMIN')
  @UseGuards(AccessTokenGuard, RolesGuard)
  remove(@Param('id') id: string) {
    this.utilityService.checkForValidUuid(id, 'provide valid product id');
    return this.productService.remove(id);
  }
}
