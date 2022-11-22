import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';

import { transcendenceTypeORMConfig } from 'src/config/user.typeorm.config';
import { DatabaseModule } from 'src/database/database.module';
import { EmailModule } from 'src/email/email.module';
import { AuthModule } from 'src/auth/auth.module';
import { join } from 'path';

import ft_config from './config/ft.config';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    ConfigModule.forRoot({ load: [ft_config] }),
    TypeOrmModule.forRoot(transcendenceTypeORMConfig),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          secure: false,
          auth: {
            user: configService.get<string>('tfa.email'),
            pass: configService.get<string>('tfa.email_pass'),
          },
        },
        defaults: {
          from: '"No Reply" ' + configService.get<string>('tfa.email'),
        },
        template: {
          dir: join(__dirname, '/template/'),
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    EmailModule,
  ],
  exports: [AppModule],
})
export class AppModule {}
