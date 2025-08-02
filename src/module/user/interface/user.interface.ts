export enum USER_TYPE {
    ADMIN = 'ADMIN',
    USER = 'USER',
    SUPER_ADMIN = 'SUPER_ADMIN',
  }
  
  export enum USER_STATUS {
    ACTIVE = 'ACTIVE',
    DISABLED = 'DISABLED',
  }

  export interface IUser {
    email?: string;
    phone?: string;
    firstName: string;
    name?: string;
    lastName: string;
    password: string;
    emailVerifiedAt?: Date | null;
    phoneVerifiedAt?: Date | null;
    blockedAt?: Date | null;
    isActive?: boolean;
    type?: USER_TYPE;
    status?: USER_STATUS;
    gender?: USER_GENDER;
    dob?: Date | null;
  }
  
  
  export enum USER_GENDER {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHERS = 'OTHERS',
  }
  