import {Component, Input, OnInit} from '@angular/core';
import {PaymentService} from '../payment.service';
import {Subscription} from 'rxjs';
import {NcpPayment} from '../../model/ncp-payment';
import {PaymentStatusRuPipe} from '../../payment-status-ru-pipe';

@Component({
    selector: 'app-payment-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

    subscriptionPayment: Subscription;
    @Input() payment: NcpPayment;
    paymentStatusRuPipe: PaymentStatusRuPipe;

    constructor() {
    }

    ngOnInit() {
    }

}
