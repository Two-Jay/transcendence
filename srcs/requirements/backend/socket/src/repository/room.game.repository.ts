import { CustomRepository } from 'src/repository/typeorm.custom.decorator';
import { RoomGameEntity } from 'src/entity/room.game.entity';
import { Repository } from 'typeorm';

@CustomRepository(RoomGameEntity)
export class RoomGameRepository extends Repository<RoomGameEntity> {}
