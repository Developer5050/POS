import { IsString, IsArray, IsNumber, IsUUID, IsOptional, IsEnum } from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  productId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

export class CreateOrderDto {
  @IsString()
  invoiceNo: string;

  @IsUUID()
  customerId: string;

  @IsArray()
  items: CreateOrderItemDto[];

  @IsOptional()
  @IsString()
  dcNo?: string;

  @IsOptional()
  @IsString()
  poNo?: string;
}

export class UpdateOrderDto {
  @IsOptional()
  @IsEnum(['paid', 'pending', 'overdue'])
  status?: 'paid' | 'pending' | 'overdue';

  @IsOptional()
  @IsString()
  poNo?: string;

  @IsOptional()
  @IsString()
  dcNo?: string;
}