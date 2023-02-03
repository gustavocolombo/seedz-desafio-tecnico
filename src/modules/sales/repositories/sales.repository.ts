import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ErrorHandling from '../../../shared/errors/error-handling';
import { CrudInterface } from '../../../shared/implementations/crud.interface';
import { Products } from '../../products/entities/Products.entity';
import { CreateSalesDTO } from '../dtos/create-sales.dto';
import { Sales } from '../entities/Sales.entity';

export class SalesRepository implements Partial<CrudInterface<Sales>> {
  constructor(
    @InjectRepository(Sales) private salesRepository: Repository<Sales>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async create({
    user_id,
    qtdProducts,
    product_id,
  }: CreateSalesDTO): Promise<Sales> {
    try {
      const product = await this.productsRepository.findOne({
        where: { id: product_id },
      });

      if (!product) throw new NotFoundException('Produto não encontrado');

      if (product.qtdAvailable === 0 || qtdProducts > product.qtdAvailable) {
        throw new BadRequestException(
          'Quantidade de produtos em estoque é insuficente para a venda',
        );
      }

      const sale = await this.salesRepository.save(
        this.salesRepository.create({ user_id, product_id, qtdProducts }),
      );

      product.qtdAvailable -= 1;

      await this.productsRepository.update(product.id, { ...product });

      return sale;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  async findById(id: string): Promise<Sales | undefined> {
    try {
      const sale = await this.salesRepository.findOne({ where: { id } });

      return sale || null;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  async findByUser(user_id: string): Promise<Sales[] | undefined> {
    try {
      const sales = await this.salesRepository.find({ where: { user_id } });

      return sales || null;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
