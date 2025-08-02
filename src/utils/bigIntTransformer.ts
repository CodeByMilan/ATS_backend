import { ValueTransformer } from 'typeorm';

/*since the data stored by mysql and postgres is in bigint for the large value and 
when returning the value it return as a string in order to avoid the data loss as js can't handle the large number
so we need to convert the string to number in order to get the correct value
*/
export class BigIntTransformerPipe implements ValueTransformer {
  to(data: number): number | string {
    return data;
  }

  from(data: string): number | null {
    return !isNaN(parseInt(data)) ? parseInt(data, 10) : null;
  }
}
