import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password']),
) {}
