//note if ES module import might show error sometime so in that case we can use Common JS-Style import. this is just the typescript mistake as it sometimes don't support ES module import.
const ms = require('ms');

//this function simply converts the time into milliseconds for eg : 1h = 3600000ms and return result in seconds
export function seconds(msValue: string): number {
  const msResult = ms(msValue);
  if (typeof msResult !== 'number') {
    throw new Error(`Invalid time string: ${msValue}`);
  }
  return msResult / 1000;
}
