import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';
import {MSG, PaymentMenuItems} from '../settings';
import {PaymentService} from './payment.service';
import {DlgImportRouterRegistryComponent} from './dialog/dlg-import-router-registry.component';
import {ActivatedRoute} from '@angular/router';
import {DetailsComponent} from './details/details.component';
import {AppService} from '../app.service';
import {DlgDeferComponent} from './calendar-defer-modal/dlg-defer.component';
import {MatSort} from '@angular/material/sort';
import {PayDataService} from '../data/pay-data-service';
import {ClientDataService} from '../data/client-data-service';
import {Subscription} from 'rxjs';
import {DlgRegistryBufferComponent} from './add-registry-modal/dlg-registry-buffer.component';
import {Payment} from './model/payment';

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
export class PaymentComponent implements OnInit, OnDestroy {

    payment: Payment;
    private paymentMenuItems = PaymentMenuItems;
    private dialogRef;
    private registry: string;
    private deferDate = new Date();
    private subscription: Subscription;
    @ViewChild(DetailsComponent, {static: true}) private childDetailsComponent: DetailsComponent;

    constructor(public payService: PaymentService,
                private notifService: NotificationsService,
                private route: ActivatedRoute,
                public dlg: MatDialog,
                private appService: AppService,
                private payDataService: PayDataService,
                private  clntDataService: ClientDataService) {
    }

    ngOnInit() {
        this.load(this.route.snapshot.params['id']);
    }

    public menuOnSelected(selectedMenuItem: number) {
        switch (selectedMenuItem) {
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
                this.dlgDefer();
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
            case this.paymentMenuItems.DEL: {
                this.dlgDelete();
            }
                break;
            default:
        }
    }

    private load(id) {
        this.appService.setProgress(true);
        this.subscription = this.payDataService.findById(id).subscribe(
            data => {
                this.payment = data;
                this.payService.setPayment(data);
                if (this.canLoadPhones(data)) this.props();
            },
            error => {
                this.appService.setProgress(false);
                this.notifService.error(error.error.errm);
            },
            () => this.appService.setProgress(false));
    }

   /* canLoadPhones() {
        return this.payService.canLoadPhones();
    }*/

    private canLoadPhones(payment) {
        return this.payService.canLoadPhones(payment);
    }

    private props() {
        this.subscription = this.clntDataService.props(this.payment.rnnSender, this.payment.profileId).subscribe(
            data => {
                this.payService.props.count = data;
                this.payService.announceProps();
                console.log(`Загружено ${data} номеров/счетов`);
            },
            error => {
                this.appService.setProgress(false);
                this.notifService.error(error.error.errm);
            },
            () => this.appService.setProgress(false));
    }

    private dlgImportEquipment() {
        this.dialogRef = this.dlg.open(DlgImportRouterRegistryComponent, {
            width: '40%',
            height: '30%',
            disableClose: true});
    }

    private dlgDistribute() {
        this.appService.setProgress(true);
        this.subscription = this.payDataService.distribute(this.payment.id, this.payment.details).subscribe(data => {
            this.payService.setPayment(data);
            this.notifService.info(MSG.distributeSuccess);
        }, error => {
            this.notifService.error(error.error.errm);
            this.appService.setProgress(false);
        }, () => this.appService.setProgress(false));
    }

    private dlgDelTransit() {
        this.appService.setProgress(true);
        this.subscription = this.payDataService.transitDel(this.payment.id).subscribe(
            data => {
                this.payService.setPayment(data);
                this.notifService.info(MSG.transitDekSuccess);
            },
            error => {
                this.notifService.error(error.error.errm);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    private dlgTransit() {
        this.appService.setProgress(true);
        this.subscription = this.payDataService.transit(this.payment.id).subscribe(data => {
                this.payService.setPayment(data);
                this.notifService.info(MSG.transitSuccess);
            },
            error => {
                this.notifService.error(error.error.errm);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    private dlgDelete() {
        this.appService.setProgress(true);
        this.subscription = this.payDataService.transit(this.payment.id).subscribe(data => {
                this.payService.setPayment(data);
                this.notifService.info(MSG.transitSuccess);
            },
            error => {
                this.notifService.error(error.error.errm);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    private dlgImportRegistry() {
        const dialogRef = this.dlg.open(DlgRegistryBufferComponent, {
            width: '50%',
            data: {registry: this.registry},
            disableClose: true});
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

    private dlgDefer() {
        const dialogRef = this.dlg.open(DlgDeferComponent, {
            width: '30%',
            data: {date: this.deferDate},
            disableClose: true});
        dialogRef.afterClosed().subscribe(result => {
                this.appService.setProgress(true);
                let today = new Date();
                let tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(0, 0, 0, 0);
                console.log(tomorrow);
                let futureDt = new Date(result);
                if (futureDt.getTime() < tomorrow.getTime()) {
                    this.notifService.warn(`Дата должна быть больше ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}. Установите дату.`);
                    return;
                }
                this.subscription = this.payDataService.defer(this.payment, futureDt.getTime()).subscribe(
                    data => {
                        this.payService.setPayment(data);
                        this.notifService.info(`Установлена дата отложенной разноски ${futureDt.getDate()}/${futureDt.getMonth() + 1}/${futureDt.getFullYear()}`);
                    },
                    error => {
                        this.notifService.error(error.error.errm);
                        this.appService.setProgress(false);
                    },
                    () => {
                        this.appService.setProgress(false);
                    }
                );
            }
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }


}
