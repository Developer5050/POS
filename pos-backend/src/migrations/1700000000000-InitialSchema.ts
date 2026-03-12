import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable uuid extension for PostgreSQL
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

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

    // Products Foreign Keys
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

    // Orders Foreign Key
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['customerId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'customers',
        onDelete: 'CASCADE',
      }),
    );

    // Order Items Table
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
          { name: 'paidAmount', type: 'numeric', precision: 15, scale: 2, default: 0 },
          { name: 'status', type: 'enum', enum: ['draft', 'sent', 'paid', 'overdue'], default: "'draft'" },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

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