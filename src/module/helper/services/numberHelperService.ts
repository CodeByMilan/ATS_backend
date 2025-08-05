import { ConfigService } from '@nestjs/config';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperNumberService {
  private env: string | undefined;
  constructor(private readonly configService: ConfigService) {
    this.env = this.configService.get('app.app_env');
  }

  random(length: number): number {
    const min: number = Number.parseInt(`1`.padEnd(length, '0'));
    const max: number = Number.parseInt(`9`.padEnd(length, '9'));
    if (this.env !== 'production') {
      return 123456;
    }
    return this.randomInRange(min, max);
  }

  randomInRange(min: number, max: number): number {
    return faker.number.int({ min, max });
  }

  percent(value: number, total: number): number {
    let tValue = value / total;
    if (Number.isNaN(tValue) || !Number.isFinite(tValue)) {
      tValue = 0;
    }
    return Number.parseFloat((tValue * 100).toFixed(2));
  }
}
