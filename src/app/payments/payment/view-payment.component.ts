import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {PaymentService} from './payment.service';
import {OperationsComponent} from './operations/operations.component';
import {PaymentsService} from '../payments.service';
import {msgType} from '../../settings';
import {Subscription} from 'rxjs';
import {NotifService} from '../../notif/notif-service.service';

@Component({
    selector: 'app-payment-view',
    templateUrl: './view-payment.component.html',
    styleUrls: ['./view-payment.component.css']
})
export class ViewPaymentComponent implements OnInit {

    isWait: boolean = true; //полоса прогресса
    @ViewChild(OperationsComponent) childOperationsComponent: OperationsComponent;
    subscription: Subscription; //для экранных уведомлений

    constructor(private router: Router,
                private paymentService: PaymentService,
                private paymentsService: PaymentsService,
                private myNotifService: NotifService) {
    }

    ngOnInit() {
        this.subscription = this.myNotifService.subscribe();
        /*
        if (!this.paymentService.payment) {
          this.router.navigate(['payments']);
        }
        */
        this.loadPaymentById(230631); //todo заблокировать 230633 - new, 230630 - distributed
        // todo разблокировать
        // this.loadDetails();
    }

    loadPaymentById(payment)   {
        this.paymentsService.getSampleData().subscribe(()=>{
            this.paymentService.setPayment(payment);
            this.loadDetails();
        })
    }

    /*
    goBack() {
        this.router.navigate(['payments']);
    }
    */

    get payment() {
        return this.paymentService.payment;
    }

    loadDetails() {
        this.isWait = true;
        this.paymentService.getPaymentDetails(this.paymentService.payment.id).subscribe(
            () => {},
            error2 => {
                this.isWait = false;
                this.myNotifService.add(msgType.error, error2);
            },
            () => {
                this.isWait = false;
            });
    }

}
