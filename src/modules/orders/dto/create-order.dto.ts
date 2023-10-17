import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { CreatePaymentDto } from './create-payment.dto';
import { CreateShippingDto } from './create-shipping.dto';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @IsNumber()
  customerId: number;

  @ValidateNested()
  @Type(() => CreatePaymentDto)
  paymentInfo: CreatePaymentDto;

  @ValidateNested()
  @Type(() => CreateShippingDto)
  shippingInfo: CreateShippingDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  orderItems: CreateOrderItemDto[];
}
