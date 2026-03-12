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