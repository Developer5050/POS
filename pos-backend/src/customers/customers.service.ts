import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async findById(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['orders'],
    });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    await this.customerRepository.update(id, updateCustomerDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const result = await this.customerRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Customer not found');
  }

  async updateTotalPurchase(customerId: string, amount: number): Promise<void> {
    const customer = await this.findById(customerId);
    await this.customerRepository.update(customerId, {
      totalPurchase: +customer.totalPurchase + amount,
      totalOrders: customer.totalOrders + 1,
    });
  }
}