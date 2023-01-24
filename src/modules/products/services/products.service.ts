import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
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
    const product = this.productsRepository.create({
      name,
      price,
      qtdAvailable,
    });

    await this.productsRepository.save(product);

    return product;
  }

  public async show(): Promise<Products[]> {
    return await this.productsRepository.find();
  }

  public async index(id: string): Promise<Products | null> {
    const product = await this.productsRepository.findOne({ where: { id } });

    return product || null;
  }

  public async update({
    id,
    name,
    price,
    qtdAvailable,
  }: UpdateProductsDTO): Promise<UpdateResult> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) throw new BadRequestException('Product not found');

    const updatedProduct = await this.productsRepository.update(product.id, {
      name,
      price,
      qtdAvailable,
    });

    return updatedProduct;
  }

  public async delete(id: string): Promise<DeleteResult> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) throw new BadRequestException('Product not found');

    const deletedProduct = await this.productsRepository.delete(product.id);

    return deletedProduct;
  }
}
