# NestJS Backend Entities & Migrations

## 1. User Entity (src/entities/user.entity.ts)

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 2. Category Entity (src/entities/category.entity.ts)

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 3. Product Entity (src/entities/product.entity.ts)

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Supplier } from './supplier.entity';
import { OrderItem } from './order-item.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  purchasePrice: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  salePrice: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sku: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @Column({ type: 'uuid', nullable: true })
  supplierId: string;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 4. Customer Entity (src/entities/customer.entity.ts)

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'int', default: 0 })
  totalOrders: number;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  totalPurchase: number;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 5. Supplier Entity (src/entities/supplier.entity.ts)

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  company: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @OneToMany(() => Product, (product) => product.supplier)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 6. Employee Entity (src/entities/employee.entity.ts)

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  position: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  salary: number;

  @Column({ type: 'date' })
  joiningDate: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 7. Order Entity (src/entities/order.entity.ts)

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { OrderItem } from './order-item.entity';
import { Invoice } from './invoice.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  invoiceNo: string;

  @ManyToOne(() => Customer, (customer) => customer.orders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  dcNo: string; // Delivery Challan Number

  @Column({ type: 'varchar', length: 100, nullable: true })
  poNo: string; // Purchase Order Number

  @Column({
    type: 'enum',
    enum: ['paid', 'pending', 'overdue'],
    default: 'pending',
  })
  status: 'paid' | 'pending' | 'overdue';

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  total: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @OneToOne(() => Invoice, (invoice) => invoice.order, { cascade: true })
  invoice: Invoice;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 8. OrderItem Entity (src/entities/order-item.entity.ts)

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Product, (product) => product.orderItems, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'uuid' })
  productId: string;

  @Column({ type: 'varchar', length: 255 })
  productName: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  total: number;

  @CreateDateColumn()
  createdAt: Date;
}
```

## 9. Invoice Entity (src/entities/invoice.entity.ts)

```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Order, (order) => order.invoice, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ type: 'uuid' })
  orderId: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  invoiceNumber: string;

  @Column({ type: 'date' })
  invoiceDate: Date;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  subtotal: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  paidAmount: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'sent', 'paid', 'overdue'],
    default: 'draft',
  })
  status: 'draft' | 'sent' | 'paid' | 'overdue';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## 10. Expense Entity (src/entities/expense.entity.ts)

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  category: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'numeric', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  attachmentUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## Initial Database Migration File

Create file: `src/migrations/1700000000000-InitialSchema.ts`

```typescript
import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users Table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'email', type: 'varchar', length: '255', isUnique: true },
          { name: 'password', type: 'varchar', length: '255' },
          { name: 'fullName', type: 'varchar', length: '255' },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // Categories Table
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', length: '255', isUnique: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // Suppliers Table
    await queryRunner.createTable(
      new Table({
        name: 'suppliers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'company', type: 'varchar', length: '255' },
          { name: 'phone', type: 'varchar', length: '20' },
          { name: 'address', type: 'text' },
          { name: 'email', type: 'varchar', length: '255', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // Products Table
    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'categoryId', type: 'uuid', isNullable: true },
          { name: 'purchasePrice', type: 'numeric', precision: 10, scale: 2 },
          { name: 'salePrice', type: 'numeric', precision: 10, scale: 2 },
          { name: 'stock', type: 'int', default: 0 },
          { name: 'sku', type: 'varchar', length: '255', isNullable: true },
          { name: 'image', type: 'varchar', length: '255', isNullable: true },
          { name: 'supplierId', type: 'uuid', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // Add foreign keys for Products
    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'products',
      new TableForeignKey({
        columnNames: ['supplierId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'suppliers',
        onDelete: 'SET NULL',
      }),
    );

    // Customers Table
    await queryRunner.createTable(
      new Table({
        name: 'customers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'phone', type: 'varchar', length: '20' },
          { name: 'email', type: 'varchar', length: '255' },
          { name: 'address', type: 'text' },
          { name: 'totalOrders', type: 'int', default: 0 },
          { name: 'totalPurchase', type: 'numeric', precision: 15, scale: 2, default: 0 },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // Employees Table
    await queryRunner.createTable(
      new Table({
        name: 'employees',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', length: '255' },
          { name: 'phone', type: 'varchar', length: '20' },
          { name: 'position', type: 'varchar', length: '255' },
          { name: 'salary', type: 'numeric', precision: 10, scale: 2 },
          { name: 'joiningDate', type: 'date' },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // Orders Table
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'invoiceNo', type: 'varchar', length: '100', isUnique: true },
          { name: 'customerId', type: 'uuid' },
          { name: 'date', type: 'date' },
          { name: 'dcNo', type: 'varchar', length: '100', isNullable: true },
          { name: 'poNo', type: 'varchar', length: '100', isNullable: true },
          { name: 'status', type: 'enum', enum: ['paid', 'pending', 'overdue'], default: "'pending'" },
          { name: 'total', type: 'numeric', precision: 15, scale: 2, default: 0 },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // Add foreign key for Orders
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['customerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customers',
        onDelete: 'CASCADE',
      }),
    );

    // OrderItems Table
    await queryRunner.createTable(
      new Table({
        name: 'order_items',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'orderId', type: 'uuid' },
          { name: 'productId', type: 'uuid' },
          { name: 'productName', type: 'varchar', length: '255' },
          { name: 'quantity', type: 'int' },
          { name: 'price', type: 'numeric', precision: 10, scale: 2 },
          { name: 'total', type: 'numeric', precision: 15, scale: 2 },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // Add foreign keys for OrderItems
    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['orderId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['productId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'products',
        onDelete: 'SET NULL',
      }),
    );

    // Invoices Table
    await queryRunner.createTable(
      new Table({
        name: 'invoices',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'orderId', type: 'uuid' },
          { name: 'invoiceNumber', type: 'varchar', length: '100', isUnique: true },
          { name: 'invoiceDate', type: 'date' },
          { name: 'subtotal', type: 'numeric', precision: 15, scale: 2 },
          { name: 'taxAmount', type: 'numeric', precision: 10, scale: 2, default: 0 },
          { name: 'totalAmount', type: 'numeric', precision: 15, scale: 2 },
          { name: 'paidAmount', type: 'varchar', length: '100', isNullable: true },
          { name: 'status', type: 'enum', enum: ['draft', 'sent', 'paid', 'overdue'], default: "'draft'" },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // Add foreign key for Invoices
    await queryRunner.createForeignKey(
      'invoices',
      new TableForeignKey({
        columnNames: ['orderId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'CASCADE',
      }),
    );

    // Expenses Table
    await queryRunner.createTable(
      new Table({
        name: 'expenses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'category', type: 'varchar', length: '255' },
          { name: 'description', type: 'text' },
          { name: 'amount', type: 'numeric', precision: 15, scale: 2 },
          { name: 'date', type: 'date' },
          { name: 'attachmentUrl', type: 'varchar', length: '255', isNullable: true },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order (due to foreign keys)
    const tableNames = [
      'invoices',
      'order_items',
      'orders',
      'expenses',
      'employees',
      'customers',
      'products',
      'suppliers',
      'categories',
      'users',
    ];

    for (const tableName of tableNames) {
      const table = await queryRunner.getTable(tableName);
      if (table) {
        await queryRunner.dropTable(tableName);
      }
    }
  }
}
```

## Database Configuration File

Create file: `src/config/database.config.ts`

```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as Entities from '../entities';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [Object.values(Entities)],
  synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', false),
  logging: configService.get<boolean>('DATABASE_LOGGING', false),
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'typeorm_migrations',
});
```

## package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "build": "nest build",
    "typeorm": "typeorm-ts-node-esm",
    "migration:generate": "npm run typeorm -- migration:generate",
    "migration:run": "npm run typeorm -- migration:run",
    "migration:revert": "npm run typeorm -- migration:revert"
  }
}
```

## Running Everything

1. **Set up PostgreSQL database:**
   ```bash
   createdb pos_db
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file with database credentials**

4. **Run migrations:**
   ```bash
   npm run migration:run
   ```

5. **Start the backend:**
   ```bash
   npm run start:dev
   ```

Backend will be running on `http://localhost:3000`
