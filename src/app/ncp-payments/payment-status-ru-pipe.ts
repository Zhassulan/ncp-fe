import {Pipe, PipeTransform } from '@angular/core';
import {PaymentStatusRu} from '../settings';

@Pipe({name: 'paymentStatusRu'})
export class PaymentStatusRuPipe implements PipeTransform {
    transform(status: number): string {
        return PaymentStatusRu[status];
    }
}
