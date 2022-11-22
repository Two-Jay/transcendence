import { CustomRepository } from 'src/repository/typeorm.custom.decorator';
import { GameEntity } from 'src/entity/game.entity';
import { Repository } from 'typeorm';

@CustomRepository(GameEntity)
export class GameRepository extends Repository<GameEntity> {}
