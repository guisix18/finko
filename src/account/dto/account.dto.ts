import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @MaxLength(50)
  @ApiProperty({
    description: 'Name of the account',
    maxLength: 50,
  })
  name: string;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(9999999999)
  @ApiProperty({
    description: 'Initial balance of the account',
    minimum: 0.1,
    maximum: 9999999999,
  })
  balance?: number;
}

export class UpdateAccountDto extends PartialType(
  PickType(CreateAccountDto, ['name']),
) {}

export class AccountDto {
  @IsNumber()
  @ApiProperty({
    description: 'Account ID',
  })
  id: number;

  @IsString()
  @ApiProperty({
    description: 'Account name',
  })
  name: string;
}
export class GetAccountDto {
  rows: AccountDto[];
}
