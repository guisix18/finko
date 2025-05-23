import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AccountService } from './account.service';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { RecordWithId } from 'src/common/record-with-id';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import { CreateAccountDto } from './dto/account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new account',
    description: 'Create a new account with the provided details',
  })
  @ApiCreatedResponse({
    description: 'Account created successfully',
    type: RecordWithId,
  })
  @ApiConflictResponse({
    description: 'Account with this name already exists',
  })
  @HttpCode(HttpStatus.CREATED)
  async createAccount(
    @Body() dto: CreateAccountDto,
    @CurrentUser() user: UserFromJwt,
  ): Promise<RecordWithId> {
    return this.accountService.createAccount(dto, user);
  }
}
