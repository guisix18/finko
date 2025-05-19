import { Injectable } from '@nestjs/common';
import { Prisma, CodeVerification } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class CodeVerificationService {
  constructor() {}

  async createNewCode(
    userId: number,
    now: Date,
    prismaTx: Prisma.TransactionClient,
  ): Promise<CodeVerification> {
    const expirationDate = new Date(now);
    expirationDate.setMinutes(now.getMinutes() + 30); // Vou expirar em 30 minutos

    const newCode = await prismaTx.codeVerification.create({
      data: {
        code: randomUUID(),
        created_at: now,
        expire_date: expirationDate,
        user_id: userId,
      },
    });

    await this.invalidateOldCodes(newCode, prismaTx);

    return newCode;
  }

  private async invalidateOldCodes(
    newCodeVerification: CodeVerification,
    prismaTx: Prisma.TransactionClient,
  ): Promise<void> {
    await prismaTx.codeVerification.updateMany({
      where: {
        user_id: newCodeVerification.user_id,
        already_used: false,
        NOT: {
          id: newCodeVerification.id,
        },
      },
      data: {
        expired: true,
      },
    });

    return;
  }

  async markCodeAsUsed(
    userId: number,
    codeVerificationId: number,
    prismaTx: Prisma.TransactionClient,
  ): Promise<void> {
    await Promise.all([
      prismaTx.codeVerification.update({
        where: {
          id: codeVerificationId,
        },
        data: {
          already_used: true,
        },
      }),
      prismaTx.user.update({
        where: {
          id: userId,
        },
        data: {
          is_active: true,
        },
      }),
    ]);

    return;
  }
}
