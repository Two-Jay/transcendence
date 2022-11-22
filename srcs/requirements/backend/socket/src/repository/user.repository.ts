import { CustomRepository } from 'src/repository/typeorm.custom.decorator';
import { UserEntity } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
