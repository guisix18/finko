import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { RecordWithId } from 'src/common/record-with-id';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CodeDto } from './dto/code.dto';

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

  @IsPublic()
  @Get('validate-email')
  @ApiOperation({
    summary: 'Validate email',
    description: 'Validate the email of the user',
  })
  async validateEmail(@Query() query: CodeDto): Promise<void> {
    return this.userService.validateEmail(query.code);
  }
}
