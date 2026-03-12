import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { ProductsService } from '../products/products.service';
import { CustomersService } from '../customers/customers.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly productsService: ProductsService,
    private readonly customersService: CustomersService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const customer = await this.customersService.findById(createOrderDto.customerId);

    const order = this.orderRepository.create({
      customerId: createOrderDto.customerId,
      invoiceNo: createOrderDto.invoiceNo,
      dcNo: createOrderDto.dcNo,
      poNo: createOrderDto.poNo,
      date: new Date(),
      status: 'pending',
    });

    const savedOrder = await this.orderRepository.save(order);

    let orderTotal = 0;

    for (const item of createOrderDto.items) {
      const product = await this.productsService.findById(item.productId);

      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
      });

      await this.orderItemRepository.save(orderItem);
      orderTotal += orderItem.total;

      // Update product stock
      await this.productsService.updateStock(item.productId, -item.quantity);
    }

    // Update order total
    await this.orderRepository.update(savedOrder.id, { total: orderTotal });

    // Update customer total purchase
    await this.customersService.updateTotalPurchase(createOrderDto.customerId, orderTotal);

    return this.findById(savedOrder.id);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['customer', 'items', 'invoice'],
    });
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'items', 'invoice'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.orderRepository.update(id, updateOrderDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const order = await this.findById(id);
    // Restore stock for all items
    for (const item of order.items) {
      await this.productsService.updateStock(item.productId, item.quantity);
    }
    await this.orderRepository.delete(id);
  }
}