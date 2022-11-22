import { CacheModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { DatabaseService } from 'src/database/database.service';
import { GameService } from 'src/game/game.service';
import { AppService } from 'src/app.service';

// import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    // CacheModule.register({
    //   isGlobal: true,
    //   store: redisStore,
    //   host: process.env.REDIS_HOST,
    //   port: process.env.REDIS_PORT,
    //   ttl: 86400000,
    // }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
  ],
  providers: [AppService, GameService],
  exports: [GameService],

})
export class GameModule {}
