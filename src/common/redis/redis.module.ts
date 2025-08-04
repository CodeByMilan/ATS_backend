import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { REDIS_CLIENT_CONNECTION } from './redis.constant';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT_CONNECTION,
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ) => {
        let isConnected = false;
        const client = createClient({
          password: configService.get<string>('helper.redis.password'),
          socket: {
            host: configService.get<string>('helper.redis.host'),
            port: Number(configService.get<number>('helper.redis.port')),
            reconnectStrategy: (retries) => {
              if (retries > 50) {
                throw new Error('Redis limit retry connection');
              } else if (retries > 25) {
                return 30 * 1000;
              }
              if (retries > 10) {
                return 15 * 1000;
              }
              return 10 * 100;
            },
          },
        });

        client.on('error', (err) => {
          isConnected = false;
          Logger.error('Redis connection error', err);
        });
        const logger = new Logger(RedisModule.name);

        client.on('connect', () => {
          isConnected = true;
          logger.log('Redis is connected successfully');
        });

        await client.connect();
        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT_CONNECTION],
})
export class RedisModule {}
