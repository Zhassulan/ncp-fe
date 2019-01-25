import {Component, OnInit} from '@angular/core';
import {PaymentService} from '../payment.service';

@Component({
    selector: 'app-payment-info',
    templateUrl: './info.component.html',
    styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

    constructor(private paymentService: PaymentService) {
    }

    ngOnInit() {
    }

    get payment() {
        return this.paymentService.payment;
    }

}
