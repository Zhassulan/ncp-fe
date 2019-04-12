import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PaymentService} from './payment.service';
import {OperationsComponent} from './operations/operations.component';
import {PaymentsService} from '../payments.service';
import {msgType} from '../../settings';
import {Observable, Subscription} from 'rxjs';
import {NotifService} from '../../notif/notif-service.service';
import {concat} from 'rxjs/observable/concat';

@Component({
    selector: 'app-payment-view',
    templateUrl: './view-payment.component.html',
    styleUrls: ['./view-payment.component.css']
})
export class ViewPaymentComponent implements OnInit {

    isWait: boolean;
    @ViewChild(OperationsComponent) childOperationsComponent: OperationsComponent;
    progressSubscription: Subscription; //для экранных уведомлений
    paymentId: number;

    constructor(private router: Router,
                public paymentService: PaymentService,
                private paymentsService: PaymentsService,
                private myNotifService: NotifService,
                private route: ActivatedRoute) {
    }

    get payment() {
        return this.paymentService.payment;
    }

    ngOnInit() {
        this.paymentId = this.route.snapshot.params['id'];
        this.progressSubscription = this.paymentsService.progressAnnounced$.subscribe(
            data => {
                this.isWait = data;
            });
        this.loadPayment();
    }

    loadPayment() {
        this.paymentsService.setProgress(true);
        let first = this.paymentService.loadPayment(this.paymentId);
        let second = this.paymentService.getPaymentDetails(this.paymentId);
        const result = concat(first, second);
        result.subscribe(
            data => {
            }, error => {
                this.paymentsService.setProgress(false);
                this.myNotifService.add(msgType.error, error);
            }, () => {
                this.paymentsService.setProgress(false);
            });
    }

}