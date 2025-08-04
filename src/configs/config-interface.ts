export interface IDatabaseConfig {
  type: 'postgres' | 'mysql' ;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  synchronize: boolean;
}


export interface IRedisConfig{
  host: string;
  port: number;
  password: string;
}