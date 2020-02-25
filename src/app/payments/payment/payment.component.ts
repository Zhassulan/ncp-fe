import {Component, OnInit, ViewChild} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {MatDialog} from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';
import {msgs, PaymentMenuItems, PaymentStatus, rests} from '../../settings';
import {PaymentsService} from '../payments.service';
import {concat} from 'rxjs';
import {PaymentService} from './payment.service';
import {UserService} from '../../user/user.service';
import {DialogComponent} from './equipment/dialog/dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {DetailsComponent} from './details/details.component';
import {AppService} from '../../app.service';
import {Utils} from '../../utils';
import {AddRegistryModalComponent} from './add-registry-modal/add-registry-modal.component';
import {PaymentDetail} from '../model/payment-detail';

export interface RegistryDialogData {
    registry: string;
}

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

    @ViewChild(DetailsComponent, {static: true}) childDetailsComponent: DetailsComponent;
    paymentId: number;
    paymentMenuItems = PaymentMenuItems;
    dialogRef;
    registry: string;
    paymentDetails = [];

    constructor(private router: Router,
                public paymentService: PaymentService,
                private paymentsService: PaymentsService,
                private notifService: NotificationsService,
                private route: ActivatedRoute,
                private logger: NGXLogger,
                public dialog: MatDialog,
                private userService: UserService,
                private appService: AppService) {
    }

    get payment() {
        return this.paymentService.payment;
    }

    get details() {
        return this.paymentService.details;
    }

    ngOnInit() {
        this.paymentId = this.route.snapshot.params['id'];
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
            case this.paymentMenuItems.REGISTRY: {
                this.loadRegistry();
            }
                break;
            default:

        }
    }

    loadPayment() {
        this.appService.setProgress(true);
        let first = this.paymentService.loadPayment(this.paymentId);
        let second = this.paymentService.getPaymentDetails(this.paymentId);
        const result = concat(first, second);
        result.subscribe(
            data => {
            }, error => {
                this.appService.setProgress(false);
                this.notifService.error(error);
            }, () => {
                this.appService.setProgress(false);
            });
    }

    menuLoadEquipmentFileDlg() {
        this.dialogRef = this.dialog.open(DialogComponent, {width: '30%', height: '30%'});
        this.dialogRef.afterClosed().subscribe(result => {
            if (result != 'cancel') {

            }
        });
    }

    async menuDistribute() {
        let res = await this.paymentService.distributionCheckConditions(this.paymentId);
        if (res) {
            this.distribute();
        } else {
            this.notifService.error(msgs.msgDistributionFailed);
        }
    }

    distribute() {
        this.appService.setProgress(true);
        let msg;
        this.paymentService.distribute().subscribe(distributeRes => {
                console.log('Accepted result from distribution ' + Utils.toJsonString(distributeRes));
                if (distributeRes.result == rests.restResultOk) {
                    this.paymentService.setPaymentByData(distributeRes.data);
                    this.paymentService.showPaymentStatus(distributeRes.data.status, distributeRes.data.id);
                    //this.loadPayment();
                } else {
                    msg = msgs.msgErrDistributePayment + ' ID ' + this.paymentId + '. ' + distributeRes.data + ' (' + distributeRes.result + ')' + this.userService.logUser();
                    this.logger.warn(msg + distributeRes.data + ' ' + this.userService.logUser());
                    this.notifService.warn(msgs.msgErrDistributePayment + ' ' + distributeRes.data);
                }
            },
            error2 => {
                msg = msgs.msgErrDistributePayment + ' Payment ID ' + this.paymentId + '. ' + error2 + this.userService.logUser();
                this.logger.error(msg + error2);
                this.notifService.error(msg + error2);
                this.appService.setProgress(false);
            },
            () => {
                this.appService.setProgress(false);
            });
    }

    loadRegistry(): void {
        const dialogRef = this.dialog.open(AddRegistryModalComponent, {
            width: '50%',
            data: {registry: this.registry}
        });
        dialogRef.afterClosed().subscribe(result => {
            //console.log('Result from dialog: ' + result);
            this.processRegistryDialogData(result);
        });
    }

    processRegistryDialogData(rawdata) {
        let rows = rawdata.split('\n');
        let brokenRows = [];
        if (rows.length) this.paymentDetails = [];
        for (let row of rows) {
            if (row === '') continue;
            let parts = row.split('\t');
            if (parts.length === 2) {
                let paymentDetail = new PaymentDetail();
                let b = true;
                if (isNaN(parts[0])) {
                    b = false;
                } else
                    this.isMSISDN(parts[0]) ? paymentDetail.msisdn = parts[0] : paymentDetail.account = parts[0];
                isNaN(parts[1]) ? b = false : paymentDetail.sum = parts[1];
                !b ? brokenRows.push(row) : this.paymentDetails.push(paymentDetail);
            } else {
                brokenRows.push(row);
            }
        }
        if (brokenRows.length) {
            console.log(brokenRows);
            this.notifService.warn(`Есть ошибочные строки:\n ${brokenRows}`);
        }   else {
            this.addImportedDetails();
        }
        //console.log('brokenRows:\n' + brokenRows);
        //console.log('registries:\n' + this.paymentDetails);
    }

    isMSISDN(value) {
        return /^(707|747|708|700|727|701|702|705|777|756|7172|771)(\d{7}$)/i.test(value);
    }

    addImportedDetails() {
        this.paymentService.delAll();
        for (let paymentDetail of this.paymentDetails) {
            paymentDetail.distrStrategy = this.paymentService.determineDistrStrategyByDetail(paymentDetail);
            paymentDetail.status = PaymentStatus.STATUS_NEW;
            this.paymentService.addNewDetail(paymentDetail);
        }
    }

}
