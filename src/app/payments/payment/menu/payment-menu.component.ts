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
import {Observable} from 'rxjs';

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
                this.paymentService.checkFilePayment();
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
                    let batch = []; //observables array
                    //create equipment
                    this.details.forEach(detail => {
                        batch.push(this.paymentService.newEquipment(this.paymentService.paymentParam.id, this.paymentService.createEquipmentByDetail(this.paymentService.paymentParam.id, detail)));
                    });
                    const getDetails$ = this.paymentService.getPaymentDetails(this.paymentService.paymentParam.id);
                    const getPaymentData$ = this.paymentService.getPaymentData(this.paymentService.paymentParam.id);
                    batch.push(getDetails$, getPaymentData$);
                    let combined$ = Observable.concat(batch);
                    combined$.subscribe(
                        ()=> {
                            msg = msgs.msgSuccessDistributed + 'ID платежа ' + this.paymentService.paymentParam.id + this.userService.logUser();
                            this.dialogService.addItem(null, msg);
                        },
                        error2 => {
                            msg = msgs.msgErrDistributePayment + 'ID платежа ' + this.paymentService.paymentParam.id + this.userService.logUser();
                            this.logger.error(msg + error2);
                            this.dialogService.addItem(null, msg);
                        });
                } else {
                    msg = msgs.msgErrDistributePayment + ' ID платежа ' + this.paymentService.paymentParam.id + '. ' + data.data + ' (' + data.result + ')' + this.userService.logUser();
                    this.logger.warn(msg + data.data);
                    this.dialogService.addItem(null, msg);
                }
            },
            error2 => {
                msg = msgs.msgErrDistributePayment + ' ID платежа ' + this.paymentService.paymentParam.id + '. ' + error2 + this.userService.logUser();
                this.logger.error(msg + error2);
                this.dialogService.addItem(null, msg);
                this.dialogService.setWaitNot();
            },
            () => {
                this.dialogService.setWaitNot();
            });
    }

}
