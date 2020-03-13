import {Component, OnInit, ViewChild} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {MatDialog} from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';
import {msgs, PaymentMenuItems, PaymentStatus} from '../../settings';
import {PaymentsService} from '../payments.service';
import {PaymentService} from './payment.service';
import {UserService} from '../../user/user.service';
import {DialogComponent} from './equipment/dialog/dialog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {DetailsComponent} from './details/details.component';
import {AppService} from '../../app.service';
import {AddRegistryModalComponent} from './add-registry-modal/add-registry-modal.component';
import {CalendarDeferModalComponent} from './calendar-defer-modal/calendar-defer-modal.component';
import {DialogService} from '../../dialog/dialog.service';
import {MatSort} from '@angular/material/sort';

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
    isValidRegistry: boolean = false;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    private _msisdns: String [] = [];
    private _accounts: String [] = [];

    constructor(private router: Router,
                public paymentService: PaymentService,
                private paymentsService: PaymentsService,
                private notifService: NotificationsService,
                private route: ActivatedRoute,
                private log: NGXLogger,
                public dlg: MatDialog,
                private userService: UserService,
                private appService: AppService,
                private dlgService: DialogService) {
    }

    get msisdns() {
        return this._msisdns;
    }

    get accounts() {
        return this._accounts;
    }

    get payment() {
        return this.paymentService.payment;
    }

    get details() {
        return this.paymentService.payment.details;
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
            default:
        }
    }

    load(id) {
        this.appService.setProgress(true);
        this.paymentService.loadPayment(id).subscribe(
            data => {
                if (!this.paymentService.isBlocked()) this.loadPhones(data.profileId);
            },
            error => {
                this.appService.setProgress(false);
                this.notifService.error(error);
            },
            () => {
                this.appService.setProgress(false);
            }
        );
    }

    loadPhones(id) {
        this.paymentService.loadPhones(id).subscribe(
            data => {
                this._accounts = [];
                this._msisdns = [];
                for (let item of this.paymentService.phones) {
                    if (item.msisdn) this._msisdns.push(item.msisdn);
                    if (item.account) this._accounts.push(item.account.toString());
                }
            },
            error => {
                this.appService.setProgress(false);
                this.notifService.error(error);
            },
            () => {
                this.appService.setProgress(false);
            }
        );
    }

    dlgImportEquipment() {
        this.dialogRef = this.dlg.open(DialogComponent, {width: '30%', height: '30%'});
        this.dialogRef.afterClosed().subscribe(result => {
            if (result != 'cancel') {
            }
        });
    }

    dlgDistribute() {
        this.appService.setProgress(true);
        this.paymentService.distribute().subscribe( data => {
            this.notifService.info(msgs.msgSuccessDistributed);
        }, error => {
            this.notifService.error(error);
            this.appService.setProgress(false);
        }, () => {
            this.appService.setProgress(false);
        })
    }

    async dlgDistributeOld() {
        /*let res = await this.paymentService.distributionCheckConditions(this.paymentService.payment.id);
        res ? this.distribute() : this.notifService.error(msgs.msgDistributionFailed);*/
    }

    dlgImportRegistry() {
        let valids = 0;
        let invalids = 0;
        let i = 1;
        let registrySum = 0;
        const dialogRef = this.dlg.open(AddRegistryModalComponent, {
            width: '50%',
            data: {registry: this.registry}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                this.isValidRegistry = false;
                return;
            }
            let data = this.paymentService.importRegistryData(result);
            if (data.broken.length) {
                this.notifService.warn(`Есть ошибочные строки:\n ${data.broken}`);
                return;
            }
            for (let item of data.imported) {
                registrySum += Number(item.sum);
            }
            this.appService.setProgress(true);
            let sum = 0;
            this.paymentService.registryValidation(this.dlgService, data.imported).subscribe(
                data => {
                    if (data.result) {
                        this.dlgService.addItem(i++ + ') ' + data.data + ' - ' + msgs.msgValid);
                        valids++;
                    } else {
                        this.dlgService.addItem(i++ + ') ' + data.data + ' - ' + msgs.msgNoData);
                        invalids++;
                    }
                },
                error => {
                    this.notifService.error(error);
                    console.log(error);
                    this.appService.setProgress(false);
                },
                () => {
                    let msg;
                    this.dlgService.addItem(`Проверено ${valids + invalids} из ${data.imported.length} элементов, из них валидные ${valids} и ошибочных ${invalids}.`);
                    if (invalids > 0) {
                        this.dlgService.addItem(`Ошибка. Исправьте номера\\счета и попробуйте импортировать реестр снова.`);
                    } else if (this.payment.sum != registrySum) {
                        this.dlgService.addItem(`Ошибка. Сумма импортированного реестра ${registrySum} не совпадает с суммой платежа ${this.payment.sum}.`);
                    } else {
                        this.isValidRegistry = true;
                        this.paymentService.addImportedRegistriesPayment(data.imported);
                    }
                    this.appService.setProgress(false);
                });
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
                this.payment.closeDate = dt.getTime().toString();
                this.notifService.info(`Установлена дата отложенной разноски ${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`);
                this.paymentService.defer().subscribe(
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
