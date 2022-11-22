import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { transcendenceTypeORMConfig } from 'src/config/user.typeorm.config';
import { DatabaseModule } from 'src/database/database.module';
// import { SocketGateway } from 'src/gateway/socket.gateway';
import { SocketGateway } from 'src/gateway/gateway';
import { AppController } from 'src/app.controller';
import { ChatService } from 'src/chat/chat.service';
import { AppService } from 'src/app.service';
import { ChatModule } from 'src/chat/chat.module';
import { GameModule } from './game/game.module';
import { TokenStrategy } from './guard/token.auth.strategy';

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
    DatabaseModule,
    TypeOrmModule.forRoot(transcendenceTypeORMConfig),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
    ChatModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketGateway, ChatService, TokenStrategy],
  exports: [AppService],
})
export class AppModule {}