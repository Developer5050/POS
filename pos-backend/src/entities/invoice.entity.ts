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