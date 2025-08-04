import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/database/base/repositories/baseRepository';
import {
  IUpdateOptions
} from 'src/database/interfaces/updateOption.interface';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {
    super(usersRepository);
  }
  getRepo(): Repository<UserEntity> {
    return this.usersRepository;
  }

  async _update(
    repo: UserEntity,
    options?: IUpdateOptions<UserEntity> | undefined,
  ): Promise<UserEntity> {
    return await super._update(repo, options);
  }

  async _save(
    repo: UserEntity,
    options?: IUpdateOptions<UserEntity> | undefined,
  ): Promise<UserEntity> {
    return await super._save(repo, options);
  }
}
