import { ApiProperty } from '@nestjs/swagger';

export interface UserToken {
  access_token: string;
}

export class UserTokenResponse {
  @ApiProperty({
    description: 'The JWT access token for the user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}
