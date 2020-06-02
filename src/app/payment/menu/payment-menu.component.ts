import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PaymentService} from '../payment.service';
import {PaymentMenuItems, PaymentStatus} from '../../settings';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-payment-menu',
    templateUrl: './payment-menu.component.html',
    styleUrls: ['./payment-menu.component.scss']
})
export class PaymentMenuComponent implements OnInit {

    paymentMenuItems = PaymentMenuItems;
    @Output() selectedMenuItem = new EventEmitter<number>();
    @Input() payment;

    constructor(private paymentService: PaymentService) {
    }

    ngOnInit() {
    }

    select(item: number) {
        this.selectedMenuItem.emit(item);
    }

    isBlocked() {
        this.paymentService.isBlocked();
    }

    detailsSum() {
        return this.paymentService.sumByDetails(this.payment.details);
    }

    canPasteRegistryFromBuffer() {
        return this.paymentService.canPasteRegistryFromBuffer();
    }

    canLoadEquipment() {
        return this.paymentService.canLoadEquipment();
    }

    canTransit() {
        return this.paymentService.canTransit();
    }

    canDelTransit() {
        return this.paymentService.canDelTransit();
    }

    canDefer() {
        return this.paymentService.canDefer();
    }

    canDistribute() {
        return this.paymentService.canDistribute();
    }

    canDel() {
        return this.paymentService.canDel();
    }

}
