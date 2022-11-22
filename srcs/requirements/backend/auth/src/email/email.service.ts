import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  _send(to: string, subject: string, templateName: string, context: any = {}) {
    this.mailerService
      .sendMail({
        to: to,
        subject,
        template: `./${templateName}`,
        context,
      })
      .then(() => {
        return true;
      });
  }

  signup(to: string, code: number) {
    let email = to;

    const source = to.split('@');
    if (source.length === 1) {
      email += this.configService.get('ft.email_tail');
    }

console.log('\n\nEMAIL =', email, '\n\n');

    this._send(
      // to + this.configService.get('ft.email_tail'),
      email,
      'From: noname App, include TFA code',
      'signup.ejs',
      {
        email: to,
        code: code,
      },
    );
  }
}
