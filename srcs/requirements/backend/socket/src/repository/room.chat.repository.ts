import { CustomRepository } from 'src/repository/typeorm.custom.decorator';
import { RoomChatEntity } from 'src/entity/room.chat.entity';
import { Repository } from 'typeorm';

@CustomRepository(RoomChatEntity)
export class RoomChatRepository extends Repository<RoomChatEntity> {}
