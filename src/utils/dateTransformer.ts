import { ValueTransformer } from 'typeorm';

export class DateTransformerPipe implements ValueTransformer {
  to(value: Date | null): string | null {
    return value ? value.toISOString() : null;
  }

  from(value?: string): Date | null {
    return value ? new Date(value) : null;
  }
}
