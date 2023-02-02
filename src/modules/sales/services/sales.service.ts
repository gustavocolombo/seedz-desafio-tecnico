import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import ErrorHandling from '../../../shared/errors/error-handling';
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
    try {
      const user = await this.usersRepository.findOne({
        where: { id: user_id },
      });

      const product = await this.productsRepository.findOne({
        where: { id: product_id },
      });

      if (!user || !product)
        throw new BadRequestException(
          'IDs inválidos para criar a venda, cheque os dados e tente novamente',
        );

      const finalPrice = product.price * qtdProducts;

      const sale = this.salesRepository.create({
        product_id,
        user_id,
        finalPrice,
        qtdProducts,
      });

      product.qtdAvailable -= 1;

      await this.productsRepository.update(product.id, { ...product });

      await this.salesRepository.save(sale);

      return sale;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  public async getSaleById(id: string): Promise<Sales> {
    try {
      const sale = await this.salesRepository.findOne({ where: { id } });

      if (!sale) throw new NotFoundException('Venda não encontrada');

      return sale;
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }

  public async getSaleByUser(
    user_id: string,
    options: IPaginationOptions,
  ): Promise<Pagination<Sales>> {
    try {
      const sale = await this.salesRepository.find({ where: { user_id } });

      if (!sale)
        throw new NotFoundException(
          'Usuário com vendas relacionadas não encontrado',
        );

      return paginate<Sales>(this.salesRepository, options);
    } catch (error) {
      throw new ErrorHandling(error);
    }
  }
}
