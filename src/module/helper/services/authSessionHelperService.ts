import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { EntityId, RedisConnection, Repository } from 'redis-om';
import {
  AuthSessionEntity,
  AuthSessionSchema,
  AuthSessionStatusEnum,
  AuthSessionType,
  AuthSessionTypeUpdate,
} from 'src/common/redis-om/authSession.schema';
import { REDIS_CLIENT_CONNECTION } from 'src/common/redis/redis.constant';
import * as crypto from 'crypto';
import { HelperNumberService } from './numberHelperService';

@Injectable()
export class AuthSessionHelperService implements OnModuleInit {
  authSessionRepo: Repository;
  private secretKey: string;
  constructor(
    @Inject(REDIS_CLIENT_CONNECTION) private readonly redis: RedisConnection,
    private readonly helperNumberService: HelperNumberService,
  ) {
    this.secretKey = 'a48589112a1d41f8818775cca35acd5d';
  }
  async onModuleInit() {
    if (!this.authSessionRepo) {
      this.authSessionRepo = new Repository(AuthSessionSchema, this.redis);
    }
  }
  async createSession(
    email: string,
    method: AuthSessionStatusEnum,
  ): Promise<AuthSessionEntity> {
    const sessionKey = await this._generateKey(email);
    const otp = await this._generateOtp();
    const session: AuthSessionType = {
      email,
      otp,
      sessionKey,
      method,
      isOtpVerified: false,
    };
    const newSession = await this.authSessionRepo.save({
      ...session,
    });

    await this.authSessionRepo.expire(newSession[EntityId as any], 300);

    return newSession as AuthSessionEntity;
  }

  async findOne(find?: Partial<AuthSessionType>): Promise<AuthSessionEntity> {
    await this.onModuleInit();
    await this.authSessionRepo.createIndex();
    const query = this.authSessionRepo.search();
    if (find?.email) {
      query.where('email').equals(find.email);
    }
    if (find?.otp) {
      query.where('otp').equals(find.otp);
    }
    if (find?.sessionKey) {
      query.where('key').equals(find.sessionKey);
    }
    if (find?.method) {
      query.where('method').equals(find.method);
    }
    if (find?.isOtpVerified) {
      query.where('isOtpVerified').equals(find.isOtpVerified);
    }
    return (await query.returnFirst()) as AuthSessionEntity;
  }

  async update(session: AuthSessionEntity, data: AuthSessionTypeUpdate) {
    const updatedSession = {
      ...session,
      ...data,
    };

    return (await this.authSessionRepo.save(
      updatedSession,
    )) as AuthSessionEntity;
  }

  async delete(session: AuthSessionType) {
    await this.authSessionRepo.remove(session[EntityId].toString());
  }

  async _generateOtp(): Promise<number> {
    const otp = this.helperNumberService.random(6);
    return otp;
  }

  async _generateKey(email: string): Promise<string> {
    const token = `${email}`;
    const hash = await this._generateHash(token);
    return hash;
  }

  private async _generateHash(
    data: string,
    algorithm: string = 'sha512',
  ): Promise<string> {
    const hmac = crypto.createHmac(algorithm, this.secretKey);
    hmac.update(data);
    return hmac.digest('hex');
  }
}
