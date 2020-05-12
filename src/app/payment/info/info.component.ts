import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Payment} from '../model/payment';
import {PaymentStatus} from '../../settings';
import {Subscription} from 'rxjs';
import {PaymentService} from '../payment.service';

@Component({
    selector: 'app-payment-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit, AfterViewInit {

    payment: Payment;
    PaymentStatus = PaymentStatus;
    subscription: Subscription;

    constructor(private payService: PaymentService) {
        this.subscription = payService.payAnnounced$.subscribe( data => this.payment = data);
    }

    ngOnInit() { }

    ngAfterViewInit(): void {
        this.payService.announcePayment();
    }

}
