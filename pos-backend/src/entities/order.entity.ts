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