# NestJS + PostgreSQL Backend Setup Guide for POS System

## Prerequisites
- Node.js 18+ and npm/pnpm
- PostgreSQL 12+
- Git

## Step 1: Create NestJS Project

```bash
npm i -g @nestjs/cli
nest new pos-backend
cd pos-backend
```

## Step 2: Install Required Dependencies

```bash
npm install @nestjs/typeorm typeorm pg @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt @nestjs/common @nestjs/core bcrypt
npm install -D @types/bcrypt @types/passport-jwt
```

## Step 3: Create .env File

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=pos_db
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=true

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d

NODE_ENV=development
```

## Step 4: Database Setup

### Create PostgreSQL Database

```bash
# Using psql
createdb pos_db

# Or from PostgreSQL CLI
CREATE DATABASE pos_db;
```

### Database Schema

The following tables will be created through TypeORM migrations:

1. **users** - For authentication
2. **categories** - Product categories
3. **products** - Product inventory
4. **customers** - Customer information
5. **suppliers** - Supplier information
6. **employees** - Employee records
7. **orders** - Sales orders
8. **order_items** - Items within orders
9. **invoices** - Invoice records
10. **expenses** - Business expenses

## Step 5: Project Structure

```
pos-backend/
├── src/
│   ├── config/
│   │   └── database.config.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── categories/
│   │   ├── customers/
│   │   ├── suppliers/
│   │   ├── employees/
│   │   ├── orders/
│   │   ├── invoices/
│   │   └── expenses/
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
│   ├── migrations/
│   └── main.ts
├── typeorm.config.ts
├── ormconfig.json
└── package.json
```

## Step 6: Key Files to Create

### See files in this directory for:
- `src/config/database.config.ts`
- `src/entities/*.entity.ts`
- `typeorm.config.ts`
- Migration files

## Step 7: Generate Migrations

```bash
npm run typeorm migration:generate -- -n InitialSchema
npm run typeorm migration:run
```

## Step 8: API Endpoints Overview

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user
- POST `/auth/refresh` - Refresh JWT token

### Products
- GET `/products` - Get all products
- GET `/products/:id` - Get product by ID
- POST `/products` - Create product
- PUT `/products/:id` - Update product
- DELETE `/products/:id` - Delete product

### Categories
- GET `/categories` - Get all categories
- POST `/categories` - Create category
- PUT `/categories/:id` - Update category
- DELETE `/categories/:id` - Delete category

### Customers
- GET `/customers` - Get all customers
- GET `/customers/:id` - Get customer details
- POST `/customers` - Create customer
- PUT `/customers/:id` - Update customer
- DELETE `/customers/:id` - Delete customer

### Suppliers
- GET `/suppliers` - Get all suppliers
- GET `/suppliers/:id` - Get supplier details
- POST `/suppliers` - Create supplier
- PUT `/suppliers/:id` - Update supplier
- DELETE `/suppliers/:id` - Delete supplier

### Orders
- GET `/orders` - Get all orders
- GET `/orders/:id` - Get order details
- POST `/orders` - Create order
- PUT `/orders/:id` - Update order
- DELETE `/orders/:id` - Delete order

### Employees
- GET `/employees` - Get all employees
- POST `/employees` - Create employee
- PUT `/employees/:id` - Update employee
- DELETE `/employees/:id` - Delete employee

### Invoices
- GET `/invoices` - Get all invoices
- GET `/invoices/:id` - Get invoice details

### Expenses
- GET `/expenses` - Get all expenses
- POST `/expenses` - Create expense
- DELETE `/expenses/:id` - Delete expense

## Step 9: Running the Backend

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Step 10: Database Migrations

```bash
# Generate migration
npm run typeorm migration:generate -- -n MigrationName

# Run migrations
npm run typeorm migration:run

# Revert last migration
npm run typeorm migration:revert
```

## Database Relationships

- **Category** → **Products** (One-to-Many)
- **Supplier** → **Products** (One-to-Many)
- **Customer** → **Orders** (One-to-Many)
- **Order** → **OrderItems** (One-to-Many)
- **Product** → **OrderItems** (One-to-Many)
- **Order** → **Invoice** (One-to-One)

## Validation & Error Handling

All endpoints include:
- Input validation using class-validators
- Error handling middleware
- JWT authentication guards
- Role-based access control (ready to implement)

## Next Steps

1. Create all entities based on the provided templates
2. Generate initial migration
3. Run migrations on PostgreSQL
4. Create service layer for business logic
5. Create controllers for API endpoints
6. Add guards and decorators for authentication
7. Implement validation DTOs
8. Add error handling middleware

See the accompanying configuration files for complete implementation details.
