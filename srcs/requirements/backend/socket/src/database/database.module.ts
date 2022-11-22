import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoomChatRepository } from 'src/repository/room.chat.repository';
import { RoomGameRepository } from 'src/repository/room.game.repository';
import { RelationRepository } from 'src/repository/relation.repository';
import { GameRepository } from 'src/repository/game.repository';
import { UserRepository } from 'src/repository/user.repository';

import { RoomChatEntity } from 'src/entity/room.chat.entity';
import { RoomGameEntity } from 'src/entity/room.game.entity';
import { RelationEntity } from 'src/entity/relation.entity';
import { GameEntity } from 'src/entity/game.entity';
import { UserEntity } from 'src/entity/user.entity';

import { DatabaseService } from 'src/database/database.service';

// import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoomChatEntity,
      RoomGameEntity,
      RelationEntity,
      GameEntity,
      UserEntity,
    ]),
    // CacheModule.register({
    //   isGlobal: true,
    //   store: redisStore,
    //   host: process.env.REDIS_HOST,
    //   port: process.env.REDIS_PORT,
    //   ttl: 86400000,
    // }),
  ],
  providers: [
    DatabaseService,
    RoomChatRepository,
    RoomGameRepository,
    RelationRepository,
    GameRepository,
    UserRepository,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
