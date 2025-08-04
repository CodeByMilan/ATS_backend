import { Entity, Schema } from 'redis-om';

export enum AuthSessionStatusEnum {
  LOGIN = 'login',
  REGISTER = 'register',
}

export interface AuthSessionType {
  email: string;
  otp: number;
  sessionKey: string;
  method: AuthSessionStatusEnum;
  isOtpVerified: boolean;
}
export type AuthSessionTypeUpdate = Partial<AuthSessionType>;
export type AuthSessionEntity = AuthSessionType & Entity;
export const AuthSessionSchema = new Schema('auth_session', {
  email: { type: 'string' },
  otp: { type: 'number' },
  sessionKey: { type: 'string' },
  method: { type: 'string' },
  isOtpVerified: { type: 'boolean' },
});
