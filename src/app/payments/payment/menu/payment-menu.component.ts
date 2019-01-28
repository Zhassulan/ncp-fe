import {Component, Input, OnInit} from '@angular/core';
import {PaymentStatus} from '../../../settings';
import {MatDialog} from '@angular/material';
import {DialogComponent} from '../../../equipment/dialog/dialog.component';
import {PaymentService} from '../payment.service';

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
                private paymentService: PaymentService ) {
    }

    ngOnInit() {
    }

    openFileDialog() {
        this.dialogRef = this.dialog.open(DialogComponent, {width: '50%', height: '30%'});
        this.dialogRef.afterClosed().subscribe(result => {
            this.paymentService.getOperationsFromUploadService();
            console.log('The dialog was closed');
            //this.animal = result;
        });
    }

}
