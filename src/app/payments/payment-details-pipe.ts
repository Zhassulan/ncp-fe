import {Pipe, PipeTransform } from '@angular/core';
import {shrinkDetailsColumnSize} from '../settings';

@Pipe({name: 'paymentDetailsPipe'})
export class PaymentDetailsPipe implements PipeTransform {
    transform(paymentDetails: string): string {
        return paymentDetails.replace(/.,/g, ', ');
    }
}
