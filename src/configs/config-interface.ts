export interface IDatabaseConfig {
  type: 'postgres' | 'mysql' ;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  synchronize: boolean;
}
