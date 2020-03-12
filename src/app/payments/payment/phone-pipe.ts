import {Pipe, PipeTransform} from '@angular/core';
import {msisdnLength, msisdnLengthCity} from '../../settings';

@Pipe({name: 'phonePipe'})
export class PhonePipe implements PipeTransform {

    transform(phone: string): string {
        if (phone) {
            if (phone.length == msisdnLength)
                return '(' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + ' ' + phone.slice(6);
            if (phone.length == msisdnLengthCity)
                return '(' + phone.slice(0, 4) + ') ' + phone.slice(4, 7) + ' ' + phone.slice(7);
        } else return  '';
    }

}
