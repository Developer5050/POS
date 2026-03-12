# Quick Start Guide - NestJS Backend Setup

## 5-Minute Quick Setup

### Step 1: Create Project
```bash
nest new pos-backend
cd pos-backend
```

### Step 2: Install Dependencies
```bash
npm install @nestjs/typeorm typeorm pg @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer
npm install -D @types/bcrypt @types/passport-jwt
```

### Step 3: Create Database
```bash
# Using PostgreSQL
createdb pos_db
```

### Step 4: Create .env File
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=pos_db
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d
NODE_ENV=development
PORT=3000
```

### Step 5: Copy Entity Files
Copy all entity files from `ENTITIES_AND_MIGRATIONS.md` to:
- `src/entities/user.entity.ts`
- `src/entities/category.entity.ts`
- `src/entities/product.entity.ts`
- `src/entities/customer.entity.ts`
- `src/entities/supplier.entity.ts`
- `src/entities/employee.entity.ts`
- `src/entities/order.entity.ts`
- `src/entities/order-item.entity.ts`
- `src/entities/invoice.entity.ts`
- `src/entities/expense.entity.ts`

### Step 6: Create Configuration Files

**typeorm.config.ts** (root directory):
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

**src/config/database.config.ts**:
```typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';
import { Supplier } from '../entities/supplier.entity';
import { Employee } from '../entities/employee.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Invoice } from '../entities/invoice.entity';
import { Expense } from '../entities/expense.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [User, Category, Product, Customer, Supplier, Employee, Order, OrderItem, Invoice, Expense],
  synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', false),
  logging: configService.get<boolean>('DATABASE_LOGGING', false),
});
```

### Step 7: Update app.module.ts
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './config/database.config';

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
    // Import your modules here
  ],
})
export class AppModule {}
```

### Step 8: Update main.ts
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`Running on: http://localhost:${PORT}`);
}

bootstrap();
```

### Step 9: Generate and Run Initial Migration
```bash
# Create migration
npm run typeorm migration:generate -- -n InitialSchema

# Run migration
npm run typeorm migration:run
```

### Step 10: Start Backend
```bash
npm run start:dev
```

Backend should now be running on `http://localhost:3000`

---

## Folder Structure

```
pos-backend/
├── src/
│   ├── config/
│   │   └── database.config.ts
│   ├── entities/
│   │   ├── user.entity.ts
│   │   ├── category.entity.ts
│   │   ├── product.entity.ts
│   │   ├── customer.entity.ts
│   │   ├── supplier.entity.ts
│   │   ├── employee.entity.ts
│   │   ├── order.entity.ts
│   │   ├── order-item.entity.ts
│   │   ├── invoice.entity.ts
│   │   └── expense.entity.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── dto/
│   │   │   │   └── auth.dto.ts
│   │   │   └── strategies/
│   │   │       └── jwt.strategy.ts
│   │   ├── products/
│   │   ├── customers/
│   │   └── [other modules...]
│   ├── migrations/
│   ├── app.module.ts
│   └── main.ts
├── ormconfig.ts
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Database Relationships Quick Reference

```
User (1) ──→ (Many) Orders
Category (1) ──→ (Many) Products
Supplier (1) ──→ (Many) Products
Customer (1) ──→ (Many) Orders
Order (1) ──→ (Many) OrderItems
Order (1) ──→ (1) Invoice
Product (1) ──→ (Many) OrderItems
```

---

## Common Commands

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Generate migration
npm run typeorm migration:generate -- -n MigrationName

# Run migrations
npm run typeorm migration:run

# Revert migration
npm run typeorm migration:revert

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## Testing API Endpoints

### Register User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Create Product (requires JWT token)
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Wireless Mouse",
    "categoryId": "category-uuid",
    "purchasePrice": 15,
    "salePrice": 25,
    "stock": 45,
    "supplierId": "supplier-uuid"
  }'
```

### Get All Products
```bash
curl http://localhost:3000/products
```

### Get Product by ID
```bash
curl http://localhost:3000/products/product-uuid
```

---

## Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_HOST | PostgreSQL host | localhost |
| DATABASE_PORT | PostgreSQL port | 5432 |
| DATABASE_USERNAME | DB user | postgres |
| DATABASE_PASSWORD | DB password | mypassword |
| DATABASE_NAME | Database name | pos_db |
| JWT_SECRET | JWT signing key | secret_key_here |
| JWT_EXPIRATION | Token expiration | 7d |
| NODE_ENV | Environment | development |
| PORT | Server port | 3000 |

---

## Troubleshooting

### "Database connection failed"
```bash
# Check if PostgreSQL is running
psql -U postgres -d pos_db

# Verify .env variables
cat .env
```

### "Relation does not exist"
```bash
# Run migrations
npm run typeorm migration:run

# Check migrations status
npm run typeorm migration:show
```

### "JWT token invalid"
- Make sure JWT_SECRET matches in .env
- Token should be passed as: `Authorization: Bearer <token>`
- Check token expiration

### "Port 3000 already in use"
```bash
# Change port in .env
PORT=3001

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

## Next Steps

1. **Create Modules** - Copy examples from NESTJS_CONFIG_AND_MODULES.md
2. **Add Authentication** - Use auth setup from AUTHENTICATION_AND_ADVANCED.md
3. **Seed Database** - Use the seed script to populate test data
4. **Connect Frontend** - Update frontend API base URL to `http://localhost:3000/api`
5. **Add Validations** - Add class-validators to DTOs
6. **Enable Logging** - Set DATABASE_LOGGING=true in .env
7. **Documentation** - Add Swagger for API docs

---

## Additional Resources

- [NestJS Docs](https://docs.nestjs.com)
- [TypeORM Docs](https://typeorm.io)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [JWT Guide](https://jwt.io/introduction)

---

## Final Checklist

- [ ] Project created with `nest new`
- [ ] Dependencies installed
- [ ] PostgreSQL database created
- [ ] .env file created and configured
- [ ] Entity files created
- [ ] Database config file created
- [ ] app.module.ts updated
- [ ] main.ts updated
- [ ] Initial migration generated and ran
- [ ] Backend started successfully
- [ ] API endpoints tested with curl/Postman
- [ ] Frontend connected to backend API

Once all checkboxes are complete, your POS backend is ready for full development!
