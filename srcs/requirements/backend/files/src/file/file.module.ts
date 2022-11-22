import { MulterModule } from '@nestjs/platform-express';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { FileController } from 'src/file/file.controller';
import { TokenStrategy } from 'src/guard/token.auth.strategy';
import { FileService } from 'src/file/file.service';

@Module({
    imports: [
      HttpModule,
      MulterModule.register({
        dest: './user_profile_images',
      }),
      JwtModule.register({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRE },
      }),
    ],
    controllers: [FileController],
    providers: [
      TokenStrategy,
      FileService,
    ]
})
export class FileModule {}