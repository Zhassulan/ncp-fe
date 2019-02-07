import {Component, OnInit} from '@angular/core';
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
    payment: NcpPayment;
    paymentStatusRuPipe: PaymentStatusRuPipe;

    constructor(private paymentService: PaymentService) {
    }

    ngOnInit() {
        this.payment = this.paymentService.payment;
        this.subscriptionPayment = this.paymentService.paymentAnnounced$.subscribe(
            payment => {
                this.payment = payment;
            });
    }

}
