import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';
import { User } from 'generated/prisma';
import * as bcrypt from 'bcrypt';
import { RecordWithId } from 'src/common/record-with-id';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto): Promise<RecordWithId> {
    const userExists = await this.findUserByEmail(dto.email);

    if (userExists) throw new ConflictException('User already exists');

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: bcrypt.hashSync(dto.password, 10),
      },
    });

    return {
      id: user.id,
    };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
