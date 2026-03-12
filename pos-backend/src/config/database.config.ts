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
  entities: Object.values(Entities),
  synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', false),
  logging: configService.get<boolean>('DATABASE_LOGGING', false),
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'typeorm_migrations',
});