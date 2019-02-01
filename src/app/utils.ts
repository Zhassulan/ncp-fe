import {DatePipe} from '@angular/common';

export class Utils {

    static dateToLocalString(dt: string): string {
        let dt = new Date(dt);
        let pipe = new DatePipe('ru-RU');
        return pipe.transform(dt).toString()
    }

}
