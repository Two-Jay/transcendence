import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ChatService } from 'src/chat/chat.service';
import { AppService } from 'src/app.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE },
    }),
  ],
  providers: [AppService, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
