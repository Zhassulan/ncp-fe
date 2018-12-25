import {Pipe, PipeTransform } from '@angular/core';
import {shrinkDetailsColumnSize} from '../settings';

@Pipe({name: 'paymentDetailsPipe'})
export class PaymentDetailsPipe implements PipeTransform {
    transform(paymentDetails: string): string {
        let str = paymentDetails.replace(/.,/g, ', ');
        str = str.substr(0, shrinkDetailsColumnSize);
        return str;
    }
}
