import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import ErrorHandling from '../../../shared/errors/error-handling';
import { CreateProductsDTO } from '../dtos/create-products.dto';
import { UpdateProductsDTO } from '../dtos/update-products.dto';
import { Products } from '../entities/Products.entity';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class ProductsService {
  constructor(private productRepository: ProductsRepository) {}

  public async create({
    name,
    price,
    qtdAvailable,
  }: CreateProductsDTO): Promise<Products> {
    try {
      const product = this.productRepository.create({
        name,
        price,
        qtdAvailable,
      });

      return product;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  public async index(id: string): Promise<Products> {
    try {
      const product = await this.productRepository.findById(id);

      if (!product) throw new NotFoundException('Produto não encontrado');

      return product;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  public async update({
    id,
    name,
    price,
    qtdAvailable,
  }: UpdateProductsDTO): Promise<UpdateResult> {
    try {
      const product = await this.productRepository.findById(id);

      if (!product) throw new NotFoundException('Produto não encontrado');

      const data = { id, name, price, qtdAvailable };

      const updatedProduct = await this.productRepository.update(data);

      return updatedProduct;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  public async delete(id: string): Promise<DeleteResult> {
    try {
      const product = await this.productRepository.findById(id);

      if (!product) throw new NotFoundException('Produto não encontrado');

      const deletedProduct = await this.productRepository.delete(product.id);

      return deletedProduct;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
