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
import {CalendarDeferModalComponent} from './calendar-defer-modal/calendar-defer-modal.component';

export interface RegistryDialogData {
    registry: string;
}

export interface CalendarDialogData {
    date: string;
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
    deferDate: string;
    label: string;
    show: boolean = false;
    isValidRegistry: boolean = false;

    constructor(private router: Router,
                public paymentService: PaymentService,
                private paymentsService: PaymentsService,
                private notifService: NotificationsService,
                private route: ActivatedRoute,
                private log: NGXLogger,
                public dlg: MatDialog,
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

    menuOnSelected(selected: number) {
        switch (selected) {
            case this.paymentMenuItems.LOAD_EQUIPMENT: {
                this.dlgOpenEquipment();
            }
                break;
            case this.paymentMenuItems.DISTRIBUTE: {
                this.distributeCalling();
            }
                break;
            case this.paymentMenuItems.REGISTRY: {
                this.dlgOpenRegistry();
            }
                break;
            case this.paymentMenuItems.DEFER: {
                this.dlgOpenDefer();
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
            },
            error => {
                this.appService.setProgress(false);
                this.notifService.error(error);
            }, () => {
                this.show = true;
                this.appService.setProgress(false);
            });
    }

    dlgOpenEquipment() {
        this.dialogRef = this.dlg.open(DialogComponent, {width: '30%', height: '30%'});
        this.dialogRef.afterClosed().subscribe(result => {
            if (result != 'cancel') {

            }
        });
    }

    async distributeCalling() {
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
                    this.log.warn(msg + distributeRes.data + ' ' + this.userService.logUser());
                    this.notifService.warn(msgs.msgErrDistributePayment + ' ' + distributeRes.data);
                }
            },
            error2 => {
                msg = msgs.msgErrDistributePayment + ' Payment ID ' + this.paymentId + '. ' + error2 + this.userService.logUser();
                this.log.error(msg + error2);
                this.notifService.error(msg + error2);
                this.appService.setProgress(false);
            },
            () => {
                this.appService.setProgress(false);
            });
    }

    dlgOpenRegistry() {
        const dialogRef = this.dlg.open(AddRegistryModalComponent, {
            width: '50%',
            data: {registry: this.registry}
        });
        dialogRef.afterClosed().subscribe(result => {
            //console.log('Result from dlg: ' + result);
            let data = this.paymentService.importRegistryData(result);
            data.broken.length ? this.notifService.warn(`Есть ошибочные строки:\n ${data.broken}`) :
                this.paymentService.registryValidation(data.imported) ? this.paymentService.addImportedRegistriesPayment(data.imported) : null;
        });
    }

    dlgOpenDefer() {
        const dialogRef = this.dlg.open(CalendarDeferModalComponent, {
            width: '30%',
            data: {date: this.deferDate},
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log('Result from dlg: ' + result);
            this.setDeferDate(result);
        });
    }

    setDeferDate(date) {
        console.log('Setting defer date');
        this.deferDate = date;
        //this.label = 'ожидает отложен на ' + new Date(this.deferDate).toLocaleDateString();
    }

}
