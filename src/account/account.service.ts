import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from './dto/account.dto';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { RecordWithId } from 'src/common/record-with-id';

@Injectable()
export class AccountService {
  private readonly maxAccounts = 10; // Definindo um valor bobo para o máximo de contas

  constructor(private readonly prisma: PrismaService) {}

  async createAccount(
    dto: CreateAccountDto,
    user: UserFromJwt,
  ): Promise<RecordWithId> {
    await this.verifyAccountLimit(user.id);

    const existingAccount = await this.prisma.account.findFirst({
      where: {
        name: dto.name,
        user_id: user.id,
      },
    });

    if (existingAccount) {
      throw new ConflictException('Account with this name already exists');
    }

    const account = await this.prisma.account.create({
      data: {
        name: dto.name,
        initial_balance: dto.balance,
        user_id: user.id,
      },
    });

    return {
      id: account.id,
    };
  }

  async verifyAccountLimit(userId: number): Promise<void> {
    const accountCount = await this.prisma.account.count({
      where: {
        user_id: userId,
      },
    });

    if (accountCount >= this.maxAccounts) {
      throw new ConflictException(
        `You have reached the maximum number of ${this.maxAccounts} accounts.`,
      );
    }
  }
}
