# NestJS Configuration Files & Module Examples

## 1. TypeORM Configuration (ormconfig.ts)

Create file: `ormconfig.ts` in project root

```typescript
import { DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || 'pos_db',
  entities: ['src/entities/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
  logging: true,
};

export default config;
```

## 2. App Module (src/app.module.ts)

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './config/database.config';

import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CustomersModule } from './modules/customers/customers.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { OrdersModule } from './modules/orders/orders.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { ExpensesModule } from './modules/expenses/expenses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    AuthModule,
    ProductsModule,
    CategoriesModule,
    CustomersModule,
    SuppliersModule,
    EmployeesModule,
    OrdersModule,
    InvoicesModule,
    ExpensesModule,
  ],
})
export class AppModule {}
```

## 3. Main File (src/main.ts)

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Your frontend URL
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Set API prefix
  app.setGlobal('prefix', 'api');

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Application is running on: http://localhost:${PORT}`);
}

bootstrap();
```

## 4. Products Module

### products.module.ts

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
```

### products.service.ts

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({ relations: ['category', 'supplier'] });
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'supplier'],
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    await this.productRepository.update(id, updateProductDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Product not found');
  }

  async updateStock(id: string, quantity: number): Promise<void> {
    const product = await this.findById(id);
    await this.productRepository.update(id, {
      stock: product.stock + quantity,
    });
  }
}
```

### products.controller.ts

```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
```

### dto/product.dto.ts

```typescript
import { IsString, IsNumber, IsUUID, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  categoryId: string;

  @IsNumber()
  purchasePrice: number;

  @IsNumber()
  salePrice: number;

  @IsNumber()
  stock: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsUUID()
  supplierId?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  purchasePrice?: number;

  @IsOptional()
  @IsNumber()
  salePrice?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  supplierId?: string;
}
```

## 5. Customers Module

### customers.service.ts

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['orders'],
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    await this.customerRepository.update(id, updateCustomerDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.customerRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Customer not found');
  }

  async updateTotalPurchase(customerId: string, amount: number): Promise<void> {
    const customer = await this.findById(customerId);
    await this.customerRepository.update(customerId, {
      totalPurchase: +customer.totalPurchase + amount,
      totalOrders: customer.totalOrders + 1,
    });
  }
}
```

### dto/customer.dto.ts

```typescript
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;
}

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
```

## 6. Orders Module

### orders.service.ts

```typescript
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { ProductsService } from '../products/products.service';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly productsService: ProductsService,
    private readonly customersService: CustomersService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const customer = await this.customersService.findById(createOrderDto.customerId);

    const order = this.orderRepository.create({
      customerId: createOrderDto.customerId,
      invoiceNo: createOrderDto.invoiceNo,
      dcNo: createOrderDto.dcNo,
      poNo: createOrderDto.poNo,
      date: new Date(),
      status: 'pending',
    });

    const savedOrder = await this.orderRepository.save(order);

    let orderTotal = 0;

    for (const item of createOrderDto.items) {
      const product = await this.productsService.findById(item.productId);

      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      });

      await this.orderItemRepository.save(orderItem);
      orderTotal += orderItem.total;

      // Update product stock
      await this.productsService.updateStock(item.productId, -item.quantity);
    }

    // Update order total
    await this.orderRepository.update(savedOrder.id, { total: orderTotal });

    // Update customer total purchase
    await this.customersService.updateTotalPurchase(createOrderDto.customerId, orderTotal);

    return this.findById(savedOrder.id);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['customer', 'items', 'invoice'],
    });
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'items', 'invoice'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.orderRepository.update(id, updateOrderDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const order = await this.findById(id);
    // Restore stock for all items
    for (const item of order.items) {
      await this.productsService.updateStock(item.productId, item.quantity);
    }
    await this.orderRepository.delete(id);
  }
}
```

### dto/order.dto.ts

```typescript
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
```

## 7. Quick Start Commands

```bash
# Install NestJS CLI
npm install -g @nestjs/cli

# Create new NestJS project
nest new pos-backend
cd pos-backend

# Install database dependencies
npm install @nestjs/typeorm typeorm pg @nestjs/config

# Install JWT for authentication
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt

# Install validation
npm install class-validator class-transformer

# Create entities directory
mkdir -p src/entities
mkdir -p src/config
mkdir -p src/migrations
mkdir -p src/modules/{auth,products,categories,customers,suppliers,employees,orders,invoices,expenses}

# Generate initial migration
npm run typeorm migration:generate -- -n InitialSchema

# Run migrations
npm run typeorm migration:run

# Start development server
npm run start:dev
```

## 8. Database Commands

```bash
# Create database
createdb pos_db

# Drop database
dropdb pos_db

# Connect to database with psql
psql -U postgres -d pos_db

# List all tables in psql
\dt

# View table structure
\d table_name

# Export database
pg_dump -U postgres pos_db > backup.sql

# Restore database
psql -U postgres pos_db < backup.sql
```

## 9. Environment Variables (.env template)

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password_here
DATABASE_NAME=pos_db
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=true

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRATION=7d

# Application
NODE_ENV=development
PORT=3000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001
```

## 10. Testing the API

Use curl or Postman:

```bash
# Create a product
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Mouse",
    "description": "Ergonomic wireless mouse",
    "categoryId": "uuid-here",
    "purchasePrice": 15,
    "salePrice": 25,
    "stock": 45,
    "supplierId": "uuid-here"
  }'

# Get all products
curl http://localhost:3000/products

# Get product by ID
curl http://localhost:3000/products/{id}
```

This provides a complete foundation for your POS backend!
