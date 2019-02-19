import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PaymentService} from './payment.service';
import {OperationsComponent} from './operations/operations.component';
import {PaymentsService} from '../payments.service';
import {msgType} from '../../settings';
import {Subscription} from 'rxjs';
import {NotifService} from '../../notif/notif-service.service';
import {environment} from '../../../environments/environment';

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
                public paymentService: PaymentService,
                private paymentsService: PaymentsService,
                private myNotifService: NotifService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.paymentService.setPayment(this.route.snapshot.params['id']);
        this.subscription = this.myNotifService.subscribe();

        if (this.paymentsService.payments)  {
            this.loadPaymentById(this.route.snapshot.params['id']);
        }   else {
            this.loadPaymentByIdFake(this.route.snapshot.params['id']);
        }
    }

    loadPaymentByIdFake(id)   {
        console.log("Загрузка данных фейкового платежа.");
        this.paymentsService.getSampleData().subscribe(()=> {
            this.loadDetails(id);
        });
    }

    loadPaymentById(id)  {
        console.log("Загрузка данных платежа.");
        if (this.paymentsService.payments.length > 0)  {
            this.loadDetails(id);
        }   else {
            console.log('Отсутствуют платежи. Перенаправляю на загрузку.');
            this.router.navigate(['payments']);
        }
    }

    loadDetails(id) {
        console.log('Загрузка деталей платежа');
        this.isWait = true;
        this.paymentService.getPaymentDetails(id).subscribe(
            () => {
                console.log('Загружены детали в количестве ' + this.paymentService.details.length);
            },
            error2 => {
                this.isWait = false;
                this.myNotifService.add(msgType.error, error2);
            },
            () => {
                this.isWait = false;
            });
    }

    get payment()   {
        return this.paymentService.payment;
    }

}
