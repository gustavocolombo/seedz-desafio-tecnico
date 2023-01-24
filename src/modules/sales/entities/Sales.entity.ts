import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Products } from '../../products/entities/Products.entity';
import { Users } from '../../user/entities/Users.entity';

@Entity()
export class Sales {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  qtdProducts: number;

  @Column()
  user_id: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => Users, (user) => user.id)
  users: Users[];

  @Column()
  product_id: string;

  @JoinColumn({ name: 'product_id' })
  @ManyToOne(() => Products, (product) => product.id)
  products: Products[];

  @Column()
  finalPrice?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
