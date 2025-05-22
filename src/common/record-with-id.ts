import { ApiProperty } from '@nestjs/swagger';

export class RecordWithId {
  @ApiProperty({
    description: 'The unique identifier of the record',
    type: 'number',
  })
  id: number;
}
