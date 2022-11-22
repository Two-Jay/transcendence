import { CustomRepository } from 'src/repository/typeorm.custom.decorator';
import { RelationEntity } from 'src/entity/relation.entity';
import { Repository } from 'typeorm';

@CustomRepository(RelationEntity)
export class RelationRepository extends Repository<RelationEntity> {}
