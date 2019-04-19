import {Component, Input, OnInit} from '@angular/core';
import {NcpPayment} from '../../model/ncp-payment';
import {PaymentStatusRuPipe} from '../../payment-status-ru-pipe';

@Component({
    selector: 'app-payment-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

    @Input() payment: NcpPayment;
    paymentStatusRuPipe: PaymentStatusRuPipe;

    constructor() {
    }

    ngOnInit() {
    }

}
