import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RecordWithId } from 'src/common/record-with-id';
import { SendMailService } from 'src/mailer/mailer.service';
import { CodeVerificationService } from 'src/codeVerification/code-verifcation.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: SendMailService,
    private readonly codeVerificationService: CodeVerificationService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<RecordWithId> {
    const userExists = await this.findUserByEmail(dto.email);

    if (userExists && !userExists.is_active) {
      const now = new Date();

      await this.prisma.$transaction(
        async (prismaTx: Prisma.TransactionClient) => {
          const code = await this.codeVerificationService.createNewCode(
            userExists.id,
            now,
            prismaTx,
          );

          this.mailerService.sendEmailValidationLink({
            name: userExists.name,
            code: code.code,
            email: userExists.email,
          });

          throw new ConflictException(
            'Email already registered. Please check your email to validate your account.',
          );
        },
      );
    }

    // Se o usuário existe e está ativo

    if (userExists) {
      throw new ConflictException(
        'Email already registered. Please login or use password recovery if needed.',
      );
    }

    const now = new Date();

    return await this.prisma.$transaction(
      async (prismaTx: Prisma.TransactionClient) => {
        const user = await prismaTx.user.create({
          data: {
            name: dto.name,
            email: dto.email,
            password: bcrypt.hashSync(dto.password, 10),
            created_at: now,
          },
        });

        const code = await this.codeVerificationService.createNewCode(
          user.id,
          now,
          prismaTx,
        );

        this.mailerService.sendEmailValidationLink({
          name: user.name,
          code: code.code,
          email: user.email,
        });

        return {
          id: user.id,
        };
      },
    );
  }

  async validateEmail(code: string): Promise<void> {
    const codeVerification = await this.prisma.codeVerification.findUnique({
      where: {
        code,
        already_used: false,
        expired: false,
        created_for: {
          is_active: false,
        },
      },
      include: {
        created_for: true,
      },
    });

    if (!codeVerification) {
      throw new NotFoundException('Code not found or already used');
    }

    if (codeVerification.expire_date < new Date()) {
      await this.prisma.$transaction(
        async (prismaTx: Prisma.TransactionClient) => {
          const newCode = await this.codeVerificationService.createNewCode(
            codeVerification.created_for.id,
            new Date(),
            prismaTx,
          );

          this.mailerService.sendEmailValidationLink({
            name: codeVerification.created_for.name,
            code: newCode.code,
            email: codeVerification.created_for.email,
          });
        },
      );

      throw new ConflictException(
        'Code expired, we sent a new one. Please check your email.',
      );
    }

    await this.prisma.$transaction(
      async (prismaTx: Prisma.TransactionClient) => {
        await this.codeVerificationService.markCodeAsUsed(
          codeVerification.user_id,
          codeVerification.id,
          prismaTx,
        );
      },
    );
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async findUserById(
    id: number,
    prismaTx?: Prisma.TransactionClient,
  ): Promise<User | null> {
    const prisma = prismaTx ?? this.prisma;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }
}
