import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/database/base/entity/baseEntity';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index } from 'typeorm';
import {
  IUser,
  USER_GENDER,
  USER_STATUS,
  USER_TYPE,
} from '../interface/user.interface';
import { DateTransformerPipe } from 'src/utils/dateTransformer';

export const USER_TABLE_NAME = 'user';
@Entity({ name: USER_TABLE_NAME })
export class UserEntity extends DatabaseBaseEntity implements IUser {
  // profilePicture?: null | FileEntity = null;

  @ApiProperty()
  @Column({ type: String, length: 100, unique: true, nullable: true })
  email: string;

  @ApiProperty()
  @Column({ type: String, length: 100, unique: true, nullable: true })
  username?: string;

  @ApiProperty()
  @Column({ type: String, length: 50, unique: true, nullable: true })
  phone?: string;

  @ApiProperty()
  @Exclude()
  @Column({ type: 'text', nullable: true, select: false })
  password: string;

  @ApiProperty()
  @Index()
  @Column({
    type: String,
    nullable: true,
    name: 'first_name',
    default: '',
  })
  firstName: string;

  @ApiProperty()
  @Index()
  @Column({
    type: String,
    nullable: true,
    name: 'last_name',
    default: '',
  })
  lastName: string;

  @ApiProperty()
  @Index()
  @Column({
    type: String,
    nullable: true,
    default: '',
  })
  address: string;

  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true, name: 'email_verified_at' })
  emailVerifiedAt?: Date | null;
  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true, name: 'password_set_at' })
  passwordSetAt?: Date | null;

  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true, name: 'phone_verified_at' })
  phoneVerifiedAt?: Date | null;

  @Column({ type: Boolean, default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: String, length: 50, nullable: true })
  type: USER_TYPE;

  @Column({
    type: String,
    default: USER_STATUS.ACTIVE,
    name: 'status',
    nullable: true,
  })
  status: USER_STATUS;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'blocked_at',
    default: null,
  })
  blockedAt?: Date | null;

  @ApiProperty()
  @Column({ type: String, nullable: true })
  gender?: USER_GENDER;

  @ApiProperty()
  @Column({
    type: 'date',
    nullable: true,
    transformer: new DateTransformerPipe(),
  })
  dob?: Date | null;

  // @Exclude()
  // @OneToMany(() => FileEntity, (f) => f.userProfile, {
  //   createForeignKeyConstraints: false,
  // })
  // photos?: FileEntity[];

  //functions

  @BeforeInsert()
  @BeforeUpdate()
  async hashPasswordBeforeInsertOrUpdate() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
