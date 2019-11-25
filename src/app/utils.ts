import {DatePipe} from '@angular/common';
import {NGXLogger} from 'ngx-logger';
import {Md5} from 'ts-md5';

export class Utils {

    constructor(private logger: NGXLogger) {
    }

    static dateToLocalString(dt: string): string {
        let pipe = new DatePipe('ru-RU');
        return pipe.transform(new Date(dt)).toString();
    }

    static removeRepeatedSpaces(str): string {
        return str.replace(/\s\s+/g, ' ');
    }

    /**
     * Печать объекта в формате JSON
     * @param obj
     */
    printObj(obj) {
        this.logger.info(JSON.stringify(obj, undefined, 2));
    }

    static toJsonString(obj) {
        return JSON.stringify(obj, undefined, 2);
    }


    static getMd5(strVal) {
        let md5 = new Md5();
        md5.appendStr(strVal);
        /*
        .appendAsciiStr('a different string')
        .appendByteArray(blob);
        */
        // Generate the MD5 hex string

        return md5.end().toString();
    }

    static convertMillsToDate(mills)    {
        let options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        let dt = new Date(mills).toLocaleString("ru", options);
        return new Date(mills).toLocaleString("ru", options).replace(',','');
    }

}
