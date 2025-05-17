import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { RecordWithId } from 'src/common/record-with-id';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post('')
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user with the provided details',
  })
  async createUser(@Body() dto: CreateUserDto): Promise<RecordWithId> {
    return this.userService.createUser(dto);
  }
}
