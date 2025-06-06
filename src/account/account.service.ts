import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AccountDto,
  CreateAccountDto,
  GetAccountDto,
  UpdateAccountDto,
} from './dto/account.dto';
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

  async getAccounts(user: UserFromJwt): Promise<GetAccountDto> {
    const accounts = await this.prisma.account.findMany({
      where: {
        user_id: user.id,
      },
    });

    const formattedAccounts = accounts.map((account) => ({
      id: account.id,
      name: account.name,
    })) satisfies AccountDto[];

    return {
      rows: formattedAccounts,
    };
  }

  async findAccountById(
    account_id: number,
    user: UserFromJwt,
  ): Promise<AccountDto> {
    const account = await this.prisma.account.findFirst({
      where: {
        id: account_id,

        user_id: user.id,
      },
    });

    if (!account) throw new NotFoundException('Account not Found');

    return {
      id: account.id,
      name: account.name,
    };
  }

  async updateAccount(
    account_id: number,
    dto: UpdateAccountDto,
    user: UserFromJwt,
  ): Promise<void> {
    const account = await this.findAccountById(account_id, user);

    await this.prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        name: dto.name,
        updated_at: new Date(),
      },
    });
  }
}
