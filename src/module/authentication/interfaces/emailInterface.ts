import { AuthSessionStatusEnum } from 'src/common/redis-om/authSession.schema';

export interface IEmail {
  email: string;
  method: AuthSessionStatusEnum;
}
