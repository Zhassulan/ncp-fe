import {DatePipe} from '@angular/common';
import {NGXLogger} from 'ngx-logger';

export class Utils {

    constructor(private logger: NGXLogger) {
    }

    static dateToLocalString(dt: string): string {
        let pipe = new DatePipe('ru-RU');
        return pipe.transform(new Date(dt)).toString()
    }

    printObj(obj)  {
        this.logger.info(JSON.stringify(obj));
    }

    static removeRepeatedSpaces(str): string  {
        return str.replace(/\s\s+/g, ' ');
    }

}
