import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RelationRepository } from 'src/repository/relation.repository';
// import { FriendRepository } from 'src/repository/friend.repository';
// import { BlockRepository } from 'src/repository/block.repository';
import { GameRepository } from 'src/repository/game.repository';
import { UserRepository } from 'src/repository/user.repository';

import { RelationEntity } from 'src/entity/relation.entity';
// import { FriendEntity } from 'src/entity/friend.entity';
// import { BlockEntity } from 'src/entity/block.entity';
import { GameEntity } from 'src/entity/game.entity';
import { UserEntity } from 'src/entity/user.entity';

import { DatabaseService } from 'src/database/database.service';

// import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    TypeOrmModule.forFeature([
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
    RelationRepository,
    GameRepository,
    UserRepository,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
