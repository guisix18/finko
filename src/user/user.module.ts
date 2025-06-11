import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SendMailModule } from 'src/mailer/mailer.module';
import { CodeVerificationModule } from 'src/codeVerification/code-verification.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    PrismaModule,
    SendMailModule,
    CodeVerificationModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 5,
        },
      ],
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
