import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {PaymentService} from './payment.service';
import {OperationsComponent} from './operations/operations.component';
import {PaymentsService} from '../payments.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
    selector: 'app-payment-view',
    templateUrl: './view-payment.component.html',
    styleUrls: ['./view-payment.component.css']
})
export class ViewPaymentComponent implements OnInit {

    isWait: boolean = true;
    @ViewChild(OperationsComponent) childOperationsComponent: OperationsComponent;


    constructor(private router: Router,
                private paymentService: PaymentService,
                private paymentsService: PaymentsService,
                private notifService: NotificationsService) {
    }

    ngOnInit() {
        /*
        if (!this.paymentService.payment) {
          this.router.navigate(['payments']);
        }
        */
        //todo заблокировать
        //230633 - new, 230630 - distributed
        this.loadPaymentById(230633);
        //todo разблокировать
        //this.loadDetails();
        for (let i = 0; i <= 15; i++)   {
            this.paymentService.addOperation('СП MBB CPE Huawei 525', '7072110987', '899977760012111000000', '1111111110', 15000, 0);
        }
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
        this.paymentService.getDetails(this.paymentService.payment.id).subscribe(
            () => {
            },
            error2 => {
                this.isWait = false;
                this.notifService.error(error2);
            },
            () => {
                this.isWait = false;
            });
    }

}
