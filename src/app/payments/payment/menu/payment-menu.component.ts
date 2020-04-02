import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PaymentService} from '../payment.service';
import {PaymentMenuItems} from '../../../settings';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-payment-menu',
    templateUrl: './payment-menu.component.html',
    styleUrls: ['./payment-menu.component.css']
})
export class PaymentMenuComponent implements OnInit {

    paymentMenuItems = PaymentMenuItems;
    @Output() selectedItem = new EventEmitter<number>();
    @Input() isRegistriesValid: boolean;
    subscription: Subscription;
    details = [];

    constructor(private paymentService: PaymentService) {
        this.subscription = this.paymentService.paymentAnnounced$.subscribe(
            payment => {
                this.details = payment.details;
            });
    }

    ngOnInit() { }

    select(item: number) { this.selectedItem.emit(item); }

    isBlocked() { this.paymentService.isBlocked(); }

    detailsSum() {
        return this.paymentService.detailsSum();
    }

    paymentSum() {
        return this.paymentService.payment.sum;
    }

}
