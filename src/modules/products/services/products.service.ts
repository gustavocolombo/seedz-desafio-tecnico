import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import ErrorHandling from '../../../shared/errors/error-handling';
import { CreateProductsDTO } from '../dtos/create-products.dto';
import { UpdateProductsDTO } from '../dtos/update-products.dto';
import { Products } from '../entities/Products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
  ) {}

  public async create({
    name,
    price,
    qtdAvailable,
  }: CreateProductsDTO): Promise<Products> {
    try {
      const product = this.productsRepository.create({
        name,
        price,
        qtdAvailable,
      });

      await this.productsRepository.save(product);

      return product;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  public async show(
    options: IPaginationOptions,
  ): Promise<Pagination<Products>> {
    try {
      return paginate<Products>(this.productsRepository, options);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  public async index(id: string): Promise<Products> {
    try {
      const product = await this.productsRepository.findOne({ where: { id } });

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
      const product = await this.productsRepository.findOne({ where: { id } });

      if (!product) throw new NotFoundException('Produto não encontrado');

      const updatedProduct = await this.productsRepository.update(product.id, {
        name,
        price,
        qtdAvailable,
      });

      return updatedProduct;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  public async delete(id: string): Promise<DeleteResult> {
    try {
      const product = await this.productsRepository.findOne({ where: { id } });

      if (!product) throw new NotFoundException('Produto não encontrado');

      const deletedProduct = await this.productsRepository.delete(product.id);

      return deletedProduct;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
