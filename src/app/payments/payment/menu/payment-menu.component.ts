import {Component, Input, OnInit} from '@angular/core';
import {msgs, msgType, PaymentStatus, rests} from '../../../settings';
import {MatDialog} from '@angular/material';
import {DialogComponent} from '../../../equipment/dialog/dialog.component';
import {PaymentService} from '../payment.service';
import {NcpPayment} from '../../model/ncp-payment';
import {DialogService} from '../../../dialog/dialog.service';
import {NGXLogger} from 'ngx-logger';
import {UserService} from '../../../user/user.service';
import {Utils} from '../../../utils';
import {Observable, Subscription} from 'rxjs';
import {PaymentDetail} from '../../model/payment-detail';
import {NotifService} from '../../../notif/notif-service.service';
import {PaymentsService} from '../../payments.service';

@Component({
    selector: 'app-payment-menu',
    templateUrl: './payment-menu.component.html',
    styleUrls: ['./payment-menu.component.css']
})
export class PaymentMenuComponent implements OnInit {

    @Input() payment: NcpPayment;
    paymentStatuses = PaymentStatus;
    dialogRef;
    subscription: Subscription; //для экранных уведомлений

    constructor(public dialog: MatDialog,
                private paymentService: PaymentService,
                private dialogService: DialogService,
                private logger: NGXLogger,
                private userService: UserService,
                private myNotifService: NotifService,
                private paymentsService: PaymentsService) {
    }

    ngOnInit() {
        this.subscription = this.myNotifService.subscribe();
    }

    get operations() {
        return this.paymentService.operations;
    }

    get details() {
        return this.paymentService.details;
    }

    openFileDialog() {
        this.dialogRef = this.dialog.open(DialogComponent, {width: 'auto', height: '30%'});
        this.dialogRef.afterClosed().subscribe(result => {
            if (result != 'cancel') {

            }
        });
    }

    get paymentId() {
        return this.paymentService.payment.id;
    }

    distributeMenu()    {
        if (this.paymentService.isCurrentSumValid())    {
            this.distribute();
        }   else    {
            this.myNotifService.add(msgType.warn, 'Ошибка! Сумма разносок не совпадает с суммой платежа');
        }
    }

    distribute() {
        let msg;
        this.dialogService.clear();
        this.dialogService.title = 'Разноска платежа ID ' + this.paymentId +  ' от ' + Utils.dateToLocalString(this.paymentService.payment.creationDate);
        this.dialogService.openDialog();
        this.dialogService.setWait();
        this.paymentService.distribute().subscribe(distributeRes => {
                if (distributeRes.result == rests.restResultOk) {
                    this.paymentService.getPaymentDetails(this.paymentId).subscribe();
                    //this.paymentService.getPaymentData(this.paymentId).subscribe();
                    this.paymentService.setPaymentByPayment(distributeRes.data);
                    msg = msgs.msgSuccessDistributed + 'ID платежа ' + this.paymentId+ this.userService.logUser();
                    this.dialogService.addItem(null, msg);
                    //обновление платежа в кеш списке сервиса
                    this.paymentsService.updatePaymentListItem(this.paymentId, distributeRes.data);
                }
                if (distributeRes.result == rests.restResultErrDb) {
                    msg = msgs.msgErrDistributePayment + ' ID платежа ' + this.paymentId + '. ' + distributeRes.data + ' (' + distributeRes.result + ')' + this.userService.logUser();
                    this.logger.warn(msg + distributeRes.data);
                    this.dialogService.addItem(null, msg);
                }
            },
            error2 => {
                msg = msgs.msgErrDistributePayment + ' ID платежа ' + this.paymentId + '. ' + error2 + this.userService.logUser();
                this.logger.error(msg + error2);
                this.dialogService.addItem(null, msg);
                this.dialogService.setWaitNot();
            },
            () => {
                this.dialogService.setWaitNot();
            });
    }

    isBlocked():boolean  {
        return this.paymentService.isBlocked();
    }

}
