import { AllowedRoles, User } from '@/decorators';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard, RolesGuard } from '../auth/guards';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(
    @User('userId') userId: string,
    @Body() createOrderDto: CreateOrderDto
  ) {
    return this.orderService.create(userId, createOrderDto);
  }

  @Get()
  @AllowedRoles('MAINTAINER', 'ADMIN')
  @UseGuards(AccessTokenGuard, RolesGuard)
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
