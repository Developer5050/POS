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