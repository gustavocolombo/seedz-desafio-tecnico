import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ErrorHandling from '../../../shared/errors/error-handling';
import { CrudInterface } from '../../../shared/implementations/crud.interface';
import { DeleteResultSerializer } from '../../../shared/serializers/delete-result.serializer';
import { UpdateResultSerializer } from '../../../shared/serializers/update-result.serializer';
import { CreateProductsDTO } from '../dtos/create-products.dto';
import { UpdateProductsDTO } from '../dtos/update-products.dto';
import { Products } from '../entities/Products.entity';

export class ProductsRepository implements CrudInterface<Products> {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  async create(data: CreateProductsDTO): Promise<Products> {
    try {
      const product = await this.productsRepository.save(
        this.productsRepository.create(data),
      );

      return product;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
  async findById(id: string): Promise<Products | undefined> {
    try {
      const product = await this.productsRepository.findOne({ where: { id } });

      return product || null;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
  async update(data: UpdateProductsDTO): Promise<UpdateResultSerializer> {
    try {
      const product = await this.productsRepository.update(data.id, {
        ...data,
      });

      return product;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
  async delete(id: string): Promise<DeleteResultSerializer> {
    try {
      const product = await this.productsRepository.delete(id);

      return product;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
