# NestJS Authentication & Advanced Features

## 1. Auth Module Setup

### auth.module.ts

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

### auth.service.ts

```typescript
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, fullName } = registerDto;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      fullName,
    });

    await this.userRepository.save(user);

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      message: 'User registered successfully',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
```

### auth.controller.ts

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

### dto/auth.dto.ts

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
```

### strategies/jwt.strategy.ts

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return this.authService.validateUser(payload.sub);
  }
}
```

### decorators/auth.decorator.ts

```typescript
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const Auth = () => UseGuards(AuthGuard('jwt'));
```

## 2. Using Auth in Controllers

```typescript
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
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
}
```

## 3. Database Seeding

Create file: `src/seeds/seed.ts`

```typescript
import { DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Supplier } from '../entities/supplier.entity';
import { Product } from '../entities/product.entity';
import { Customer } from '../entities/customer.entity';
import { Employee } from '../entities/employee.entity';

const seedDatabase = async () => {
  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || 'pos_db',
    entities: ['src/entities/*.entity.ts'],
    synchronize: false,
  });

  await AppDataSource.initialize();

  // Seed Categories
  const categoryRepo = AppDataSource.getRepository(Category);
  const categories = categoryRepo.create([
    { name: 'Electronics', description: 'Electronic devices' },
    { name: 'Clothing', description: 'Apparel items' },
    { name: 'Groceries', description: 'Food items' },
  ]);
  await categoryRepo.save(categories);

  // Seed Suppliers
  const supplierRepo = AppDataSource.getRepository(Supplier);
  const suppliers = supplierRepo.create([
    {
      name: 'Ali Raza',
      company: 'TechParts Co.',
      phone: '+92 300 1112233',
      address: 'Industrial Area, Lahore',
    },
    {
      name: 'Kamran Sheikh',
      company: 'FashionWholesale',
      phone: '+92 321 4445566',
      address: 'Textile Market, Faisalabad',
    },
  ]);
  await supplierRepo.save(suppliers);

  // Seed Products
  const productRepo = AppDataSource.getRepository(Product);
  const products = productRepo.create([
    {
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse',
      category: categories[0],
      purchasePrice: 15,
      salePrice: 25,
      stock: 45,
      supplier: suppliers[0],
    },
    {
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub',
      category: categories[0],
      purchasePrice: 22,
      salePrice: 40,
      stock: 30,
      supplier: suppliers[0],
    },
    {
      name: 'Cotton T-Shirt',
      description: '100% cotton t-shirt',
      category: categories[1],
      purchasePrice: 8,
      salePrice: 20,
      stock: 100,
      supplier: suppliers[1],
    },
  ]);
  await productRepo.save(products);

  // Seed Customers
  const customerRepo = AppDataSource.getRepository(Customer);
  const customers = customerRepo.create([
    {
      name: 'Ahmed Khan',
      phone: '+92 300 1234567',
      email: 'ahmed@email.com',
      address: '123 Main St, Lahore',
      totalOrders: 0,
      totalPurchase: 0,
    },
    {
      name: 'Sara Ali',
      phone: '+92 321 9876543',
      email: 'sara@email.com',
      address: '456 Park Ave, Karachi',
      totalOrders: 0,
      totalPurchase: 0,
    },
  ]);
  await customerRepo.save(customers);

  // Seed Employees
  const employeeRepo = AppDataSource.getRepository(Employee);
  const employees = employeeRepo.create([
    {
      name: 'Zain Ahmed',
      phone: '+92 300 1111111',
      position: 'Store Manager',
      salary: 45000,
      joiningDate: new Date('2024-01-15'),
    },
    {
      name: 'Hira Fatima',
      phone: '+92 321 2222222',
      position: 'Cashier',
      salary: 25000,
      joiningDate: new Date('2024-03-20'),
    },
  ]);
  await employeeRepo.save(employees);

  console.log('Database seeded successfully!');
  await AppDataSource.destroy();
};

seedDatabase().catch((err) => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
```

Add to package.json:

```json
{
  "scripts": {
    "seed": "ts-node src/seeds/seed.ts"
  }
}
```

Run with: `npm run seed`

## 4. Error Handling Middleware

Create file: `src/common/filters/http-exception.filter.ts`

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const error =
      typeof exceptionResponse === 'object'
        ? exceptionResponse
        : { statusCode: status, message: exceptionResponse };

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      ...error,
    });
  }
}
```

Use in main.ts:

```typescript
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

app.useGlobalFilters(new HttpExceptionFilter());
```

## 5. Request/Response Interceptor

Create file: `src/common/interceptors/logging.interceptor.ts`

```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        console.log(`${method} ${url} - ${Date.now() - now}ms`);
      }),
    );
  }
}
```

Use in main.ts:

```typescript
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

app.useGlobalInterceptors(new LoggingInterceptor());
```

## 6. Pagination Helper

Create file: `src/common/helpers/pagination.helper.ts`

```typescript
export interface PaginationQuery {
  page?: number;
  limit?: number;
  skip?: number;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function getPaginationParams(
  page: number = 1,
  limit: number = 10,
): { skip: number; take: number } {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}

export function createPaginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginationResponse<T> {
  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
```

Use in service:

```typescript
async findAll(page: number = 1, limit: number = 10) {
  const { skip, take } = getPaginationParams(page, limit);
  const [data, total] = await this.productRepository.findAndCount({
    skip,
    take,
  });
  return createPaginationResponse(data, total, page, limit);
}
```

## 7. Environment Configuration

Enhanced .env template:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=secure_password
DATABASE_NAME=pos_db
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=true

# JWT Authentication
JWT_SECRET=your_secret_key_change_this_in_production
JWT_EXPIRATION=7d

# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api

# CORS
CORS_ORIGIN=http://localhost:3001,http://localhost:3000

# Logging
LOG_LEVEL=debug

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

## 8. API Documentation

Install Swagger:

```bash
npm install @nestjs/swagger swagger-ui-express
```

Update main.ts:

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('POS System API')
  .setDescription('Point of Sale System API Documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('docs', app, document);
```

Add decorators to controller:

```typescript
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products' })
  findAll() {
    return this.productsService.findAll();
  }
}
```

## 9. Deployment Considerations

### Docker Setup

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: pos_db
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - '3000:3000'
    environment:
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_USERNAME: postgres
      DATABASE_PASSWORD: postgres
      DATABASE_NAME: pos_db
      JWT_SECRET: your-secret-key
    depends_on:
      - postgres

volumes:
  postgres_data:
```

Run with: `docker-compose up`

### Production Build

```bash
npm run build
npm run start:prod
```

## 10. Testing Example

Install testing dependencies:

```bash
npm install --save-dev @nestjs/testing jest @types/jest
```

Create `products.service.spec.ts`:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProductRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [{ id: '1', name: 'Product 1' }];
      mockProductRepository.find.mockResolvedValue(products);

      const result = await service.findAll();

      expect(result).toEqual(products);
    });
  });
});
```

Run tests: `npm run test`

This provides a production-ready NestJS backend structure!
