import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PaymentService} from './payment.service';
import {OperationsComponent} from './operations/operations.component';
import {PaymentsService} from '../payments.service';
import {dic, msgs, msgType, rests, STATUSES} from '../../settings';
import {from, concat, merge, Observable, of, Subscription, Subject} from 'rxjs';
import {PaymentMenuItems} from '../../settings';
import {DialogComponent} from '../../equipment/dialog/dialog.component';
import {DialogService} from '../../dialog/dialog.service';
import {NGXLogger} from 'ngx-logger';
import {MatDialog} from '@angular/material';
import {UserService} from '../../user/user.service';
import {NotificationsService} from 'angular2-notifications';
import {flatMap} from 'tslint/lib/utils';
import {IccSum} from '../model/icc-sum';
import {forEach} from '@angular/router/src/utils/collection';
import {RestResponse} from '../../data/rest-response';

@Component({
    selector: 'app-payment-view',
    templateUrl: './view-payment.component.html',
    styleUrls: ['./view-payment.component.css']
})

export class ViewPaymentComponent implements OnInit {

    isWait: boolean;
    @ViewChild(OperationsComponent) childOperationsComponent: OperationsComponent;
    progressSubscription: Subscription; //для экранных уведомлений
    paymentId: number;
    paymentMenuItems = PaymentMenuItems;
    dialogRef;

    constructor(private router: Router,
                public paymentService: PaymentService,
                private paymentsService: PaymentsService,
                private notifService: NotificationsService,
                private route: ActivatedRoute,
                private dialogService: DialogService,
                private logger: NGXLogger,
                public dialog: MatDialog,
                private userService: UserService,) {
    }

    get payment() {
        return this.paymentService.payment;
    }

    get operations() {
        return this.paymentService.operations;
    }

    get details() {
        return this.paymentService.details;
    }

    ngOnInit() {
        this.paymentId = this.route.snapshot.params['id'];
        this.progressSubscription = this.paymentsService.progressAnnounced$.subscribe(
            data => {
                this.isWait = data;
            });
        this.loadPayment();
    }

    onSelected(selected: number) {
        switch (selected) {
            case this.paymentMenuItems.LOAD_EQUIPMENT: {
                this.menuLoadEquipmentFileDlg();
            }
                break;
            case this.paymentMenuItems.DISTRIBUTE: {
                this.menuDistribute();
            }
                break;
            default:

        }
    }

    loadPayment() {
        this.paymentsService.setProgress(true);
        let first = this.paymentService.loadPayment(this.paymentId);
        let second = this.paymentService.getPaymentDetails(this.paymentId);
        const result = concat(first, second);
        result.subscribe(
            data => {
            }, error => {
                this.paymentsService.setProgress(false);
                this.notifService.error(error);
            }, () => {
                this.paymentsService.setProgress(false);
            });
    }

    menuLoadEquipmentFileDlg() {
        this.dialogRef = this.dialog.open(DialogComponent, {width: 'auto', height: '30%'});
        this.dialogRef.afterClosed().subscribe(result => {
            if (result != 'cancel') {

            }
        });
    }

    async menuDistribute() {
        let res = await this.checkConditions();
        if (res) {
            this.distribute();
        }
    }

    async checkConditions(): boolean {
        this.paymentsService.setProgress(true);
        let msg;
        let result = true;
        if (!this.paymentService.isCurrentSumValid()) {
            this.notifService.warn(msgs.msgBadValue + this.paymentService.getDetailsSum());
            result = false;
        }
        let iccSumList = [];
        if (this.paymentService.equipments.length > 0) {
            this.paymentService.equipments.forEach(equipment => {
                if (!equipment.nomenclature.toLowerCase().includes(dic.prepaid)) {
                    let sum = this.paymentService.details.find(x => x.id === equipment.paymentDetailId).sum;
                    iccSumList.push(new IccSum(equipment.icc, sum));
                }
            });
        }
        if (iccSumList.length > 0) {
            let res = await this.checkFirstPayIccList(iccSumList);
            res.data.forEach(item => {
                if (item.status != STATUSES.STATUS_VALID) {
                    this.notifService.warn(item.icc + ' ' + item.info);
                    result = false;
                }
            });
        }
        this.paymentsService.setProgress(false);
        return result;
    }

    async checkFirstPayIccList(iccSumList) {
        let result = true;
        const response = await this.paymentService.checkFirstPayIccList(iccSumList).toPromise();
        return response;
    }

    distribute() {
        this.paymentsService.setProgress(true);
        let msg;
        this.paymentService.distribute().subscribe(distributeRes => {
                if (distributeRes.result == rests.restResultOk) {
                    this.paymentService.setPaymentByData(distributeRes.data);
                    msg = msgs.msgSuccessDistributed + 'ID платежа ' + this.paymentId + this.userService.logUser();
                    this.logger.info(msg);
                    this.notifService.success(msg);
                    this.loadPayment();
                }
                if (distributeRes.result == rests.restResultErr) {
                    msg = msgs.msgErrDistributePayment + ' ID платежа ' + this.paymentId + '. ' + distributeRes.data + ' (' + distributeRes.result + ')' + this.userService.logUser();
                    this.logger.warn(msg + distributeRes.data);
                    this.notifService.warn(msg);
                }
            },
            error2 => {
                msg = msgs.msgErrDistributePayment + ' ID платежа ' + this.paymentId + '. ' + error2 + this.userService.logUser();
                this.logger.error(msg + error2);
                this.notifService.error(msg + error2);
                this.paymentsService.setProgress(false);
            },
            () => {
                this.paymentsService.setProgress(false);
            });
    }


}