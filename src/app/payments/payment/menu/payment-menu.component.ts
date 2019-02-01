import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {msgs, PaymentStatus, rests} from '../../../settings';
import {MatDialog} from '@angular/material';
import {DialogComponent} from '../../../equipment/dialog/dialog.component';
import {PaymentService} from '../payment.service';
import {NotificationsService} from 'angular2-notifications';
import {PaymentParam} from '../../model/payment-param';
import {NcpPayment} from '../../model/ncp-payment';
import {DialogService} from '../../../dialog/dialog.service';
import {NGXLogger} from 'ngx-logger';
import {UserService} from '../../../user/user.service';
import {DatePipe, formatDate} from '@angular/common';
import {Utils} from '../../../utils';

@Component({
    selector: 'app-payment-menu',
    templateUrl: './payment-menu.component.html',
    styleUrls: ['./payment-menu.component.css']
})
export class PaymentMenuComponent implements OnInit {

    @Input() payment : NcpPayment;
    paymentStatuses = PaymentStatus;
    dialogRef;

    constructor(public dialog: MatDialog,
                private paymentService: PaymentService,
                private notifService: NotificationsService,
                private dialogService: DialogService,
                private logger: NGXLogger,
                private userService: UserService) {
    }

    ngOnInit() {
    }

    get operations() {
        return this.paymentService.operations;
    }

    get details()   {
        return this.paymentService.details;
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
        let msg;
        this.dialogService.clear();
        this.dialogService.title = 'Разноска платежа ID ' + this.paymentService.payment.paymentId + ' от ' + Utils.dateToLocalString(this.paymentService.payment.creationDate);
        this.dialogService.openDialog();
        this.dialogService.setWait();
        this.paymentService.distribute().subscribe(data => {
                if (data.result == rests.restResultOk) {
                    console.log(data.data);
                    msg = msgs.msgSuccessDistributed + 'ID платежа ' + data.data[0].paymentId + this.userService.logUser();
                    this.logger.info(msg);
                    this.dialogService.addItem(null, msg);
                } else {
                    msg = msgs.msgErrDelTransit + ' ID платежа ' + data.data[0].paymentId + '. ' + data.data + ' (' + data.result + ')' + this.userService.logUser();
                    this.logger.warn(msg);
                    this.dialogService.addItem(null, msg);
                }
            },
            error2 => {
                msg = msgs.msgErrDelTransit + ' ID платежа ' + this.paymentService.paymentParam.id+ '. ' + error2 + this.userService.logUser();
                this.logger.error(msg);
                this.dialogService.addItem(null, msg);
                this.dialogService.setWaitNot();
            },
            () => {
                this.dialogService.setWaitNot();
            });
    }

}
