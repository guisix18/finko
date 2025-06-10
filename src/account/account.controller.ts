import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AccountService } from './account.service';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { RecordWithId } from 'src/common/record-with-id';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/auth/models/UserFromJwt';
import {
  CreateAccountDto,
  GetAccountDto,
  UpdateAccountDto,
} from './dto/account.dto';
import { ParamsId } from 'src/common/params';

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

  @Get()
  @ApiOperation({
    summary: 'Get all accounts',
    description: 'Retrieve all accounts for the current user',
  })
  @ApiOkResponse({
    description: 'Accounts retrieved successfully',
    type: GetAccountDto,
  })
  @HttpCode(HttpStatus.OK)
  async getAccounts(@CurrentUser() user: UserFromJwt): Promise<GetAccountDto> {
    return this.accountService.getAccounts(user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account' })
  @ApiOkResponse({
    description: 'Account updated successfully',
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @HttpCode(HttpStatus.OK)
  async updateAccount(
    @Param() params: ParamsId,
    @Body() updateAccountDto: UpdateAccountDto,
    @CurrentUser() user: UserFromJwt,
  ): Promise<void> {
    return this.accountService.updateAccount(params.id, updateAccountDto, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an account by ID' })
  @ApiOkResponse({ description: 'Account successfully deleted' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  async deleteAccount(
    @Param() params: ParamsId,
    @CurrentUser() user: UserFromJwt,
  ): Promise<void> {
    return this.accountService.deleteAccount(params.id, user);
  }
}
