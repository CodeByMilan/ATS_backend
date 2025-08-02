import { ApiProperty } from '@nestjs/swagger';
import { BigIntTransformerPipe } from 'src/utils/bigIntTransformer';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export class DatabaseBaseEntity extends BaseEntity {
  @ApiProperty()
  @Generated()
  @PrimaryColumn({
    type: 'bigint',
    transformer: new BigIntTransformerPipe(),
  })
  id: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;
}
