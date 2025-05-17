import { Module } from '@nestjs/common';
import { CodeVerificationService } from './code-verifcation.service';

@Module({
  providers: [CodeVerificationService],
  exports: [CodeVerificationService],
})
export class CodeVerificationModule {}
