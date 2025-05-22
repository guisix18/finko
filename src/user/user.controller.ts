import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { RecordWithId } from 'src/common/record-with-id';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CodeDto } from './dto/code.dto';
import { Throttle } from '@nestjs/throttler';
import { usersConflictsErrors } from './swagger/user.swagger';

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
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: RecordWithId,
  })
  @ApiResponse(usersConflictsErrors)
  @Throttle({
    default: {
      limit: 2,
      ttl: 60,
    },
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
  @Throttle({
    default: {
      limit: 2,
      ttl: 60,
    },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async validateEmail(@Query() query: CodeDto): Promise<void> {
    return this.userService.validateEmail(query.code);
  }
}
