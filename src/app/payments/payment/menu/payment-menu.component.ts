import {Component, Input, OnInit} from '@angular/core';
import {msgs, PaymentStatus} from '../../../settings';
import {MatDialog} from '@angular/material';
import {DialogComponent} from '../../../equipment/dialog/dialog.component';
import {PaymentService} from '../payment.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
    selector: 'app-payment-menu',
    templateUrl: './payment-menu.component.html',
    styleUrls: ['./payment-menu.component.css']
})
export class PaymentMenuComponent implements OnInit {

    @Input() payment;
    paymentStatuses = PaymentStatus;
    dialogRef;

    constructor(public dialog: MatDialog,
                private paymentService: PaymentService,
                private notifService: NotificationsService) {
    }

    ngOnInit() {
    }

    get operations() {
        return this.paymentService.operations;
    }

    openFileDialog() {
        this.dialogRef = this.dialog.open(DialogComponent, {width: '50%', height: '30%'});
        this.dialogRef.afterClosed().subscribe(result => {
            if (result != 'cancel') {
                if (!this.paymentService.checkTotalSum()) {
                    this.notifService.warn(msgs.msgErrTotalSum);
                }
                if (!this.paymentService.checkDocNum()) {
                    this.notifService.warn(msgs.msgErrDocNum);
                }
                if (!this.paymentService.checkRnn()) {
                    this.notifService.warn(msgs.msgErrRnn);
                }
            }
        });
    }

    distribute()    {

    }

}
