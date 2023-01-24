import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Products } from '../../products/entities/Products.entity';
import { Users } from '../../user/entities/Users.entity';
import { CreateSalesDTO } from '../dtos/create-sales.dto';
import { Sales } from '../entities/Sales.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sales) private salesRepository: Repository<Sales>,
    @InjectRepository(Products)
    private productsRepository: Repository<Products>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  public async create({
    user_id,
    product_id,
    qtdProducts,
  }: CreateSalesDTO): Promise<Sales> {
    const checkIfUserExist = await this.usersRepository.findOne({
      where: { id: user_id },
    });

    const checkIfProductExists = await this.productsRepository.findOne({
      where: { id: product_id },
    });

    if (!checkIfUserExist || !checkIfProductExists)
      throw new BadRequestException(
        'Invalid ID`s to create sale, verify again',
      );

    const finalPrice = checkIfProductExists.price * qtdProducts;

    const sale = this.salesRepository.create({
      product_id,
      user_id,
      finalPrice,
      qtdProducts,
    });

    await this.salesRepository.save(sale);

    return sale;
  }

  public async getSaleById(id: string): Promise<Sales | null> {
    const sale = await this.salesRepository.findOne({ where: { id } });

    return sale || null;
  }

  public async getSaleByUser(user_id: string): Promise<Sales[] | null> {
    const sale = await this.salesRepository.find({ where: { user_id } });

    return sale || null;
  }
}
