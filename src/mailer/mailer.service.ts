import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { SendEmailValidationLinkDto } from './dto/mailer.dto';
import { generateValidationEmail } from './emails/email-validation-link';
const Mailgen = require('mailgen');

@Injectable()
export class SendMailService {
  private baseUrl: string;
  private mailGenerator: typeof Mailgen;

  constructor(
    @Inject(MailerService) private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('BASE_URL') ?? 'http://localhost:3000';

    this.mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Finko',
        link: this.baseUrl,
        copyright: 'Copyright © 2025 Finko. Todos os direitos reservados.',
      },
    });
  }

  sendEmailValidationLink(dto: SendEmailValidationLinkDto) {
    const { name, email, code } = dto;

    const emailBody = generateValidationEmail(
      name,
      code,
      `${this.baseUrl}/user/validate-email?code=${code}`,
    );

    const emailHTML = this.mailGenerator.generate(emailBody);
    const emailText = this.mailGenerator.generatePlaintext(emailBody);

    this.mailerService.sendMail({
      to: email,
      subject: 'Finko - Validação de Email',
      html: emailHTML,
      text: emailText,
    });
  }
}
