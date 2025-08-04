import { ApiProperty } from '@nestjs/swagger';

export class AuthToken {
  @ApiProperty({
    type: 'string',
    example: 'accessToken',
  })
  accessToken: string;

  @ApiProperty({
    type: 'number',
    description: 'expiry second',
  })
  expiresInSeconds: number;
}
