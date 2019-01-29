import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {PaymentService} from './payment.service';
import {OperationsComponent} from './operations/operations.component';
import {PaymentsService} from '../payments.service';

@Component({
    selector: 'app-payment-view',
    templateUrl: './view-payment.component.html',
    styleUrls: ['./view-payment.component.css']
})
export class ViewPaymentComponent implements OnInit {

    isWait: boolean = true;
    @ViewChild(OperationsComponent) childOperationsComponent: OperationsComponent;
    backHidden: boolean = true;

    constructor(private router: Router,
                private paymentService: PaymentService,
                private paymentsService: PaymentsService) {
    }

    ngOnInit() {
        //todo убрать
        this.paymentsService.getSampleData().subscribe( () => {
            if (!this.paymentService.payment)
                this.paymentService.setPayment(230631);
        });
        this.isWait = false;
    }

    goBack() {
        this.router.navigate(['payments']);
    }

    get payment() {
        return this.paymentService.payment;
    }

}