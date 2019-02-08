import {DatePipe} from '@angular/common';

export class Utils {

    static dateToLocalString(dt: string): string {
        let pipe = new DatePipe('ru-RU');
        return pipe.transform(new Date(dt)).toString()
    }

    static printObj(obj)  {
        console.log(JSON.stringify(obj));
    }

}
