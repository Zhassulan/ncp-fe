import {DatePipe} from '@angular/common';
import {Md5} from 'ts-md5';
import {DateRangeMills} from './payments/model/date-range-mills';

export class Utils {

  constructor() {
  }

  static dateToLocalString(dt: string): string {
    const pipe = new DatePipe('ru-RU');
    return pipe.transform(new Date(dt)).toString();
  }

  static removeRepeatedSpaces(str): string {
    return str.replace(/\s\s+/g, ' ');
  }

  static getMd5(strVal) {
    const md5 = new Md5();
    md5.appendStr(strVal);
    /*
    .appendAsciiStr('a different string')
    .appendByteArray(blob);
    */
    // Generate the MD5 hex string

    return md5.end().toString();
  }

  static millsToDateStr(mills) {
    return new Date(mills).toLocaleString('ru').replace(',', '');
  }

  static jsonPretty(data) {
    return JSON.stringify(data, undefined, 3);
  }

  static getTodayDateRangeMills(): DateRangeMills {
    return new DateRangeMills(new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 999));
  }

  static getTodayStartTime(): Date {
    const res = new Date();
    res.setHours(0, 0, 0, 0);
    return res;
  }

  static getTodayEndTime(): Date {
    const res = new Date();
    res.setHours(23, 59, 59, 999);
    return res;
  }

}
