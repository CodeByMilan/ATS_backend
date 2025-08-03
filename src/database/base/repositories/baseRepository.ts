import {
  DeepPartial,
  EntityManager,
  FindOptionsOrder,
  FindOptionsRelations,
  Repository,
  UpdateResult,
} from 'typeorm';
import { DatabaseBaseEntity } from '../entity/baseEntity';
import { ICreateOptions } from 'src/database/interfaces/createOption.interface';
import {
  IFindAllOptions,
  IFindOneOptions,
} from 'src/database/interfaces/findOption.interface';
import { NotFoundException } from '@nestjs/common';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import {
  IUpdateOptions,
  IUpdateRawOptions,
} from 'src/database/interfaces/updateOption.interface';

export abstract class BaseRepository<T extends DatabaseBaseEntity> {
  protected _entityRepo: Repository<T>;
  protected _relations?: FindOptionsRelations<T>;

  constructor(entityRepo: Repository<T>, relations?: FindOptionsRelations<T>) {
    this._entityRepo = entityRepo;
    this._relations = relations;
  }

  /**
   *
   * @param createDto
   * @param options
   * @returns UserEntity
   */

  async _create(
    createDto: DeepPartial<T>,
    options?: ICreateOptions,
  ): Promise<T> {
    if (options?.entityManager) {
      const entity = options.entityManager.create(
        this._entityRepo.target,
        createDto,
      );
      return await options.entityManager.save(this._entityRepo.target, entity);
    }
    const entity = this._entityRepo.create(createDto);
    return await this._entityRepo.save(entity);
  }

  async _findAll(options?: IFindAllOptions<T>): Promise<T[]> {
    const find = options?.options ?? {};
    if (options?.transaction) {
      find.transaction = true;
    }
    if (options?.withDeleted) {
      find.withDeleted = true;
    }
    if (
      options?.sortBy &&
      options?.sortableColumns &&
      options?.sortableColumns?.includes(options?.sortBy as keyof T & string)
    ) {
      find.order = {
        [options.sortBy]: options.sortOrder,
      } as FindOptionsOrder<T>;
    }
    const relations = this.getRelations(options?.relations);
    if (relations) {
      find.relations = relations;
    }
    if (options?.entityManager) {
      return await options.entityManager.find(this._entityRepo.target, find);
    }
    return await this._entityRepo.find(options?.options);
  }

  async _findOne(options: IFindOneOptions<T>): Promise<T | null> {
    const find = options?.options ?? {};
    if (options?.transaction) {
      find.transaction = true;
    }
    if (options?.withDeleted) {
      find.withDeleted = true;
    }
    const relations = this.getRelations(options?.relations);
    if (relations) {
      find.relations = relations;
    }
    if (options?.entityManager) {
      return await options.entityManager
        .createQueryBuilder(this._entityRepo.target, 'entity')
        .setFindOptions(find)
        .getOne();
    }
    return await this._entityRepo
      .createQueryBuilder('entity')
      .setFindOptions(find)
      .getOne();
  }

  async _findOneOrFail(options: IFindOneOptions<T>): Promise<T> {
    try {
      const data = await this._findOne(options);
      if (!data) {
        throw new NotFoundException(
          `Cannot find ${this._entityRepo.metadata.tableName}.`,
        );
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  async _findOneById(
    id: number,
    options?: IFindOneOptions<T>,
  ): Promise<T | null> {
    const find: any = options?.options ?? {};
    if (options?.transaction) {
      find.transaction = true;
    }
    if (options?.withDeleted) {
      find.withDeleted = true;
    }
    const relations = this.getRelations(options?.relations);
    if (relations) {
      find.relations = relations;
    }
    find.where = {};
    find.where['id'] = id;
    if (options?.entityManager) {
      return await options.entityManager
        .createQueryBuilder(this._entityRepo.target, 'entity')
        .setFindOptions(find)
        .getOne();
    }
    return await this._entityRepo
      .createQueryBuilder('entity')
      .setFindOptions(find)
      .getOne();
  }

  async _updateRaw(
    updateDto: QueryDeepPartialEntity<T>,
    options: IUpdateRawOptions<T>,
  ): Promise<UpdateResult> {
    if (options?.entityManager) {
      return await options.entityManager.update(
        this._entityRepo.target,
        options.where,
        updateDto,
      );
    }
    return await this._entityRepo.update(options.where, updateDto);
  }

  async _update(repo: T, options?: IUpdateOptions<T>): Promise<T> {
    const existingData = await this._entityRepo.findOne({
      where: { id: (repo as any).id },
    });

    if (!existingData) {
      throw new Error('Entity not found');
    }

    const updatedData = { ...existingData, ...repo };
    if (options?.entityManager) {
      return await options.entityManager.save(
        this._entityRepo.target,
        updatedData,
      );
    }

    return await this._entityRepo.save(updatedData);
  }

  async _save(repo: T, options?: IUpdateOptions<T>): Promise<T> {
    const existingData = await this._entityRepo.findOne({
      where: { id: (repo as any).id },
    });

    if (!existingData) {
      throw new Error('Entity not found');
    }

    if (options?.entityManager) {
      return await options.entityManager.save(this._entityRepo.target, repo);
    }

    return await this._entityRepo.save(repo);
  }

  async _delete(repo: T, options?: IUpdateOptions<T>): Promise<T> {
    const returnRepo = { ...repo };
    if (options?.entityManager) {
      await options.entityManager.remove(this._entityRepo.target, repo);
      return returnRepo;
    }
    await this._entityRepo.remove(repo);
    return returnRepo;
  }
  getRelations(
    option?: boolean | FindOptionsRelations<T>,
  ): FindOptionsRelations<T> | null {
    if (option) {
      if (typeof option === 'boolean') {
        return this._relations ?? null;
      } else {
        return option;
      }
    }
    return null;
  }
}
