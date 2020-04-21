import {Component, Input, OnInit} from '@angular/core';
import {NcpPayment} from '../../payments/model/ncp-payment';
import {PaymentStatusRuPipe} from '../../payments/payment-status-ru-pipe';
import {Payment} from '../model/payment';

@Component({
    selector: 'app-payment-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

    @Input() payment: Payment;

    constructor() { }

    ngOnInit() { }

}
