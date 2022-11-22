import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from 'src/auth/auth.controller';

import { GoogleOauthStrategy } from 'src/guard/google.auth.strategy';
import { TokenStrategy } from 'src/guard/token.auth.strategy';
import { FtStrategy } from 'src/guard/ft.auth.strategy';

import { DatabaseService } from 'src/database/database.service';
import { EmailService } from 'src/email/email.service';
import { AuthService } from 'src/auth/auth.service';

import { RelationEntity } from 'src/entity/relation.entity';
import { GameEntity } from 'src/entity/game.entity';
import { UserEntity } from 'src/entity/user.entity';

import { RelationRepository } from 'src/repository/relation.repository';
import { GameRepository } from 'src/repository/game.repository';
import { UserRepository } from 'src/repository/user.repository';

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
    HttpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
    TypeOrmModule.forFeature([
      RelationEntity,
      GameEntity,
      UserEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    TokenStrategy,
    GoogleOauthStrategy,
    FtStrategy,
    
    DatabaseService,
    ConfigService,
    EmailService,
    AuthService,
    
    RelationRepository,
    GameRepository,
    UserRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
