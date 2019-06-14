import {Component, OnInit, ViewChild} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {MatDialog} from '@angular/material';
import {NotificationsService} from 'angular2-notifications';
import {msgs, PaymentMenuItems, PaymentStatus, PaymentStatusRu, rests} from '../../settings';
import {PaymentsService} from '../payments.service';
import {concat, Subscription} from 'rxjs';
import {PaymentService} from './payment.service';
import {UserService} from '../../user/user.service';
import {DialogComponent} from './equipment/dialog/dialog.component';
import {ActivatedRoute, PRIMARY_OUTLET, Router, UrlSegment, UrlSegmentGroup, UrlTree} from '@angular/router';
import {DetailsComponent} from './details/details.component';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

    @ViewChild(DetailsComponent) childDetailsComponent: DetailsComponent;
    paymentId: number;
    paymentMenuItems = PaymentMenuItems;
    dialogRef;

    constructor(private router: Router,
                public paymentService: PaymentService,
                private paymentsService: PaymentsService,
                private notifService: NotificationsService,
                private route: ActivatedRoute,
                private logger: NGXLogger,
                public dialog: MatDialog,
                private userService: UserService,) {
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
        this.paymentsService.setProgress(true);
        let msg;
        this.paymentService.distribute().subscribe(distributeRes => {
                if (distributeRes.result == rests.restResultOk) {
                    this.paymentService.setPaymentByData(distributeRes.data);
                    this.paymentService.showPaymentStatus(distributeRes.data.status, distributeRes.data.id);
                    //this.loadPayment();
                }
                if (distributeRes.result == rests.restResultErr) {
                    msg = msgs.msgErrDistributePayment + ' ID ' + this.paymentId + '. ' + distributeRes.data + ' (' + distributeRes.result + ')' + this.userService.logUser();
                    this.logger.warn(msg + distributeRes.data);
                    this.notifService.warn(msg);
                }
            },
            error2 => {
                msg = msgs.msgErrDistributePayment + ' ID ' + this.paymentId + '. ' + error2 + this.userService.logUser();
                this.logger.error(msg + error2);
                this.notifService.error(msg + error2);
                this.paymentsService.setProgress(false);
            },
            () => {
                this.paymentsService.setProgress(false);
            });
    }

}