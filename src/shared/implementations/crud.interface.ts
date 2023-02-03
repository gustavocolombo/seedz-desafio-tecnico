import { DeleteResultSerializer } from '../serializers/delete-result.serializer';
import { UpdateResultSerializer } from '../serializers/update-result.serializer';

export interface CrudInterface<T> {
  create(data: T): Promise<T>;
  findById(id: string): Promise<T | undefined>;
  update(data: T): Promise<UpdateResultSerializer>;
  delete(id: string): Promise<DeleteResultSerializer>;
}
