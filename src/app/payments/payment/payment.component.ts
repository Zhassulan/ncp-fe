import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';
import {msgs, PaymentMenuItems, PaymentStatusRu} from '../../settings';
import {PaymentService} from './payment.service';
import {DialogComponent} from './equipment/dialog/dialog.component';
import {ActivatedRoute} from '@angular/router';
import {DetailsComponent} from './details/details.component';
import {AppService} from '../../app.service';
import {AddRegistryModalComponent} from './add-registry-modal/add-registry-modal.component';
import {CalendarDeferModalComponent} from './calendar-defer-modal/calendar-defer-modal.component';
import {MatSort} from '@angular/material/sort';
import {PayDataService} from '../../data/pay-data-service';
import {ClientDataService} from '../../data/client-data-service';

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
    paymentMenuItems = PaymentMenuItems;
    dialogRef;
    registry: string;
    deferDate = new Date();
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    msisdns: String [] = [];
    accounts: String [] = [];

    constructor(public payService: PaymentService,
                private notifService: NotificationsService,
                private route: ActivatedRoute,
                public dlg: MatDialog,
                private appService: AppService,
                private payDataService: PayDataService,
                private  clntDataService: ClientDataService) {
    }

    get payment() {
        return this.payService.payment;
    }

    ngOnInit() {
        this.load(this.route.snapshot.params['id']);
    }

    menuOnSelected(selected: number) {
        switch (selected) {
            case this.paymentMenuItems.LOAD_EQUIPMENT: {
                this.dlgImportEquipment();
            }
                break;
            case this.paymentMenuItems.DISTRIBUTE: {
                this.dlgDistribute();
            }
                break;
            case this.paymentMenuItems.REGISTRY: {
                this.dlgImportRegistry();
            }
                break;
            case this.paymentMenuItems.DEFER: {
                this.dlgSetDeferDate();
            }
                break;
            case this.paymentMenuItems.DEL_TRANSIT: {
                this.dlgDelTransit();
            }
                break;
            case this.paymentMenuItems.TRANSIT: {
                this.dlgTransit();
            }
                break;
            default:
        }
    }

    load(id) {
        this.appService.setProgress(true);
        this.payDataService.findById(id).subscribe(
            data => {
                this.payService.setPayment(data);
                if (this.canLoadPhones()) this.loadPhones(id);
            },
            error => {
                this.appService.setProgress(false);
                this.notifService.error(error.error.errm);
            },
            () => this.appService.setProgress(false));
    }

    canLoadPhones() {
        return this.payService.canLoadPhones();
    }

    loadPhones(id) {
        this.clntDataService.phones(id).subscribe(
            data => {
                this.msisdns = data.filter(i => i.msisdn).map(i => i.msisdn);
                this.accounts = data.filter(i => i.account).map(i => String(i.account));
                console.log(`Загружено ${this.msisdns.length} номеров и ${this.accounts.length} счетов`);
            },
            error => {
                this.appService.setProgress(false);
                this.notifService.error(error.error.errm);
            },
            () => this.appService.setProgress(false));
    }

    dlgImportEquipment() {
        this.dialogRef = this.dlg.open(DialogComponent, {width: '40%', height: '30%'});
        this.dialogRef.afterClosed().subscribe(result => {
            if (result != 'cancel') {
            }
        });
    }

    dlgDistribute() {
        this.appService.setProgress(true);
        this.payDataService.distribute(this.payment.id, this.payment.details).subscribe(data => {
            this.payService.setPayment(data);
            this.notifService.info(msgs.msgSuccessDistributed);
        }, error => {
            this.notifService.error(error.error.errm);
            this.appService.setProgress(false);
        }, () => this.appService.setProgress(false));
    }

    dlgDelTransit() {
        this.appService.setProgress(true);
        this.payDataService.transitDel(this.payment.id).subscribe(
            data => {
                this.payService.setPayment(data);
                this.notifService.info(msgs.msgSuccessDelTransit);
            },
            error => {
                this.notifService.error(error.error.errm);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    dlgTransit() {
        this.appService.setProgress(true);
        this.payDataService.transit(this.payment.id).subscribe(data => {
                this.payService.setPayment(data);
                this.notifService.info(msgs.msgSuccessToTransit);
            },
            error => {
                this.notifService.error(error.error.errm);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    dlgImportRegistry() {
        const dialogRef = this.dlg.open(AddRegistryModalComponent, {
            width: '50%',
            data: {registry: this.registry}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result == null) return;
            if (result == '') return;
            if (result.length > 0) {
                let data = this.payService.importRegistryData(result);
                if (data.broken.length) {
                    this.notifService.warn(`Есть ошибочные строки:\n ${data.broken}`);
                }
            }
        });
    }

    dlgSetDeferDate() {
        const dialogRef = this.dlg.open(CalendarDeferModalComponent, {
            width: '30%',
            data: {date: this.deferDate},
        });
        dialogRef.afterClosed().subscribe(result => {
            let today = new Date();
            let tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            console.log(`tomorrow - ${tomorrow}`);
            let dt = new Date(result);
            if (dt < today || result.getTime() == today.getTime())
                this.notifService.warn(`Ошибка. Дата должна быть больше ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`);
            else if (dt.getDate() >= tomorrow.getDate() && dt.getMonth() >= tomorrow.getMonth() && dt.getFullYear() >= tomorrow.getFullYear()) {
                this.payment.closed = dt.getTime().toString();
                this.notifService.info(`Установлена дата отложенной разноски ${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`);
                this.payService.defer().subscribe(
                    data => {
                        //todo Отложить платёж
                    },
                    error => {

                    },
                    () => {

                    }
                );
            }
        });
    }

}
