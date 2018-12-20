import {Directive, ElementRef, Input} from '@angular/core';
import {PaymentStatus} from './settings';

@Directive({
    selector: '[paymentRowHighlight]'
})

export class HighlightDistributed {

    @Input() paymentStatus: number;

    constructor(el: ElementRef) {
        console.log('status: ' + this.paymentStatus);
        if (this.paymentStatus == PaymentStatus.STATUS_DISTRIBUTED)
            el.nativeElement.style.backgroundColor = 'green';
    }
}
