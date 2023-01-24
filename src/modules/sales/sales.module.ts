import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from '../products/entities/Products.entity';
import { Users } from '../user/entities/Users.entity';
import { SalesController } from './controllers/sales.controller';
import { Sales } from './entities/Sales.entity';
import { SalesService } from './services/sales.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sales, Users, Products])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
