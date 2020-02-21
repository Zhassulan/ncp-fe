import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {PaymentService} from '../payment.service';
import {PaymentMenuItems} from '../../../settings';

@Component({
    selector: 'app-payment-menu',
    templateUrl: './payment-menu.component.html',
    styleUrls: ['./payment-menu.component.css']
})
export class PaymentMenuComponent implements OnInit {

    paymentMenuItems = PaymentMenuItems;
    @Output() selectedItem = new EventEmitter<number>();

    constructor(private paymentService: PaymentService) { }

    ngOnInit() { }

    select(item: number) { this.selectedItem.emit(item); }

    get details() { return this.paymentService.details; }

    isBlocked():boolean  { return this.paymentService.isBlocked(); }

}
