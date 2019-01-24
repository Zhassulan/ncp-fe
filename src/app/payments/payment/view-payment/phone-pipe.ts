import {Pipe, PipeTransform } from '@angular/core';
import {msisdnLength} from '../../../settings';

@Pipe({name: 'phonePipe'})
export class PhonePipe implements PipeTransform {

    transform(phone: string): string {
            if (phone.length == msisdnLength)
                return '(' + phone.slice(0, 3) + ') ' + phone.slice(3, 6) + ' ' + phone.slice(6);
            else
                return phone;
    }

}
