import { Users } from '../../modules/user/entities/Users.entity';

export interface CrudInterface<T> {
  create(data: T): Promise<T>;
  findById(id: string): Promise<T | undefined>;
  update(data: T): Promise<T>;
  delete(id: string): Promise<T>;
  findByEmail(email: string): Promise<Users | undefined>;
}
