import {Injectable} from '@angular/core';
import {PaymentsService} from '../payments.service';
import {msgs, PaymentStatus, rests, STATUSES} from '../../settings';
import {NGXLogger} from 'ngx-logger';
import {UserService} from '../../user/user.service';
import {PaymentDetail} from '../model/payment-detail';
import {NcpPaymentDetails} from '../model/ncp-payment-details';
import {Equipment} from '../model/equipment';
import {Utils} from '../../utils';
import {EquipmentCheckParam} from '../model/equipment-check-param';
import {NotificationsService} from 'angular2-notifications';
import {AppService} from '../../app.service';
import {DialogService} from '../../dialog/dialog.service';
import {from, Observable, Subject} from 'rxjs';
import {concatAll} from 'rxjs/operators';
import {Payment} from './model/payment';
import {Detail} from './model/detail';
import {Phone} from './model/phone';
import {ClientDataService} from '../../data/client-data-service';
import {PayDataService} from '../../data/pay-data-service';
import {RouterService} from '../../router/router.service';

@Injectable({
    providedIn: 'root',
})
export class PaymentService {

    paymentStatuses = PaymentStatus;
    payment: Payment;
    phones: Phone [] = [];
    private paymentObs = new Subject<Payment>();
    paymentAnnounced$ = this.paymentObs.asObservable();

    constructor(private paymentsService: PaymentsService,
                private routerService: RouterService,
                private logger: NGXLogger,
                private userService: UserService,
                private notifService: NotificationsService,
                private appService: AppService,
                private clientDataService: ClientDataService,
                private payDataService: PayDataService) {
    }

    get filePaymentItems() {
        return this.routerService.routerRegistry.items;
    }

    get details() {
        return this.payment.details ? this.payment.details : null;
    }

    delAll() {
        this.payment.details = [];
        this.routerService.resetFilePayment();
        this.announcePayment();
    }

    setPayment(data) {
        this.payment = data;
        this.announcePayment();
    }

    addDetail(detail: Detail) {
        this.payment.details.push(detail);
        this.announcePayment();
    }

    delDetail(row) {
        this.payment.details.splice(this.payment.details.indexOf(row), 1);
        this.announcePayment();
    }

    announcePayment() {
        this.paymentObs.next(this.payment);
    }

    getDetailsSum(key) {
        return this.payment.details.reduce((a, b) => Number(a) + Number((b[key] || 0)), 0);
    }

    /**
     * Сравнение суммы деталей с суммой платежа
     * @returns {boolean} true - равны
     */
    checkTotalSum(): boolean {
        return Number(this.getDetailsSum('sum')) == Number(this.payment.sum);
    }

    checkDocNum(): boolean {
        return this.routerService.routerRegistry ? this.routerService.routerRegistry.header.docnum == this.payment.payDocnum : true;
    }

    addDetailsFromFilePayment() {
        let details: Detail [] = [];
        for (let item of this.filePaymentItems.slice(0, this.filePaymentItems.length)) {
            let detail = new Detail();
            detail.nomenclature = item.nomenclature;
            detail.msisdn = item.msisdn;
            detail.icc = item.icc;
            detail.account = item.account;
            detail.sum = item.sum;
            detail.status = 0;
            details.push(detail);
        }
        this.payment.details = details;
        this.announcePayment();
    }

    checkRnn(): boolean {
        return this.routerService.routerRegistry ? this.routerService.routerRegistry.header.bin == this.payment.rnnSender : true;
    }

    distribute() {
        return this.payDataService.distribute(this.payment.id, this.payment.details);
    }

    setEquipments() {
        let details: Detail[] = [];
        this.payment.details.forEach(item => {
            let detail = new Detail();
            detail.icc = detail.icc;
            detail.msisdn = detail.msisdn;
            detail.nomenclature = detail.nomenclature;
            details.push(detail);
        });
        this.payment.details = details;
        this.announcePayment();
    }

    setEquipmentsInDetails(equipments: Equipment []) {
        equipments.forEach(equipment => {
            let detail = this.payment.details.find(x => x.id == equipment.paymentDetailId);
            detail.nomenclature = equipment.nomenclature;
            detail.msisdn = equipment.msisdn;
            detail.icc = equipment.icc;
        });
    }

    getPaymentEquipments(id: number): Observable<any> {
        return new Observable(
            observer => {
                this.payDataService.equipments(id).subscribe(
                    data => {
                        this.setEquipmentsInDetails(data);
                    });
            });
    }

    isBlocked(): boolean {
        return this.payment ? this.payment.status == PaymentStatus.STATUS_DISTRIBUTED ||
            this.payment.status == PaymentStatus.STATUS_EXPIRED ||
            this.payment.status == PaymentStatus.STATUS_DELETED ||
            this.payment.status == PaymentStatus.STATUS_DEFERRED ||
            this.payment.status == PaymentStatus.STATUS_TRANSIT_DISTRIBUTED : false;
    }

    isCurrentSumValid(): boolean {
        return this.getDetailsSum('sum') == this.payment.sum;
    }

    getBercutEquipmentInfo(icc): Observable<any> {
        console.log('Получение информации оборудования по ICC ' + icc + '..');
        return new Observable(
            observer => {
                this.payDataService.bercutEquipmentInfoByIcc(icc).subscribe( data => observer.next(data));
            });
    }

    checkEquipmentParams(equipmentParams) {
        return this.payDataService.checkEquipmentParams(equipmentParams);
    }

    async distributionCheckConditions(id): Promise<boolean> {
        this.appService.setProgress(true);
        let result = true;
        /*
        result = await this.paymentBlocked(id);
        if (result) {
            this.notifService.warn(msgs.msgPaymentBlocked);
            return false;
        }
        */
        if (!this.isNewDetailsExistsForDistribution()) {
            this.notifService.warn(msgs.msgNoNewDetails);
            this.appService.setProgress(false);
            return false;
        }
        if (!this.checkTotalSum()) {
            this.notifService.warn(msgs.msgErrTotalSum);
            result = false;
        }
        if (this.routerService.routerRegistry)
            if (!this.checkDocNum()) {
                this.notifService.warn(msgs.msgErrDocNum);
                result = false;
            }
        if (!this.checkRnn()) {
            this.notifService.warn(msgs.msgErrRnn);
            result = false;
        }
        //result = await this.checkIcc();
        result = await this.checkBercutEquipment();
        this.appService.setProgress(false);
        return result;
    }

    /*async checkIcc(): Promise <boolean> {
        let result = true;
        for (const detail of this.details)  {
            if (detail.icc) {
                console.log('Проверка по icc ' + detail.icc);
                let obs = await this.dataService.getBercutEquipmentInfoByIcc(detail.icc);
                if (obs.result == rests.restResultErr) {
                    result = false;
                    this.notifService.warn(obs.data);
                }
            }
        }
        return result;
    }
    */

    async checkBercutEquipment(): Promise<boolean> {
        let result = true;
        let equipmentCheckParams = [];
        if (this.payment.details.length > 0) {
            this.payment.details.forEach(detail => {
                console.log(detail.nomenclature);
                if (detail.nomenclature) {
                    //if (!detail.nomenclature.toLowerCase().includes(dic.prepaid)) {
                    equipmentCheckParams.push(new EquipmentCheckParam(detail.icc, detail.sum, Utils.removeRepeatedSpaces(detail.nomenclature).trim().toLowerCase(), detail.account));
                    //}
                }
            });
        }
        //console.log('equipmentCheckParams:\n');
        //this.utils.printObj(equipmentCheckParams);
        if (equipmentCheckParams.length > 0) {
            this.checkEquipmentParams(equipmentCheckParams).forEach(item => {
                /*if (item.status != STATUSES.STATUS_VALID && item.status != STATUSES.STATUS_UNKNOWN) {
                    this.notifService.warn(item.icc + ' ' + item.info);
                    result = false;
                }*/
            });
        }
        return result;
    }

    isNewDetailsExistsForDistribution(): boolean {
        let result = false;
        this.payment.details.forEach(detail => {
            if (detail.status == this.paymentStatuses.STATUS_NEW) {
                result = true;
            }
        });
        return result;
    }

    importRegistryData(rawdata) {
        let importedRegistries = [];
        let rows = rawdata.split('\n');
        let brokenRows = [];
        if (rows.length) importedRegistries = [];
        for (let row of rows) {
            if (row === '\n' || row === '' || row.trim() === '' || row.replace('\t', '') === '') continue;
            let parts = row.split('\t');
            if (parts.length === 2) {
                let paymentDetail = new PaymentDetail();
                let b = true;
                if (isNaN(parts[0])) {
                    b = false;
                } else
                    this.isMSISDN(parts[0]) ? paymentDetail.msisdn = parts[0] : paymentDetail.account = parts[0];
                isNaN(parts[1]) ? b = false : paymentDetail.sum = parts[1];
                !b ? brokenRows.push(row) : importedRegistries.push(paymentDetail);
            } else {
                brokenRows.push(row);
            }
        }
        return {'broken': brokenRows, 'imported': importedRegistries};
    }

    isMSISDN(value) {
        return /^(707|747|708|700|727|701|702|705|777|756|7172|771)(\d{7}$)/i.test(value);
    }

    registryValidation(dlgService: DialogService, importedRegistry: NcpPaymentDetails []): Observable<any> {
        dlgService.clear();
        dlgService.title = 'Проверка импортированного реестра разносок';
        dlgService.openDialog();
        dlgService.addItem('Проверка ' + importedRegistry.length + ' элементов:');
        let apiCalls: Observable<any> [] = [];
        for (let registry of importedRegistry) {
            apiCalls.push(registry.account ?
                this.validateAccount(this.payment.profileId, registry.account) :
                this.validateMsisdn(this.payment.profileId, registry.msisdn));
        }
        const array$ = from(apiCalls);
        return array$.pipe(concatAll());
    }

    addImportedRegistriesPayment(importedRegistry) {
        let details: Detail [] = [];
        for (let paymentDetail of importedRegistry) {
            paymentDetail.status = PaymentStatus.STATUS_NEW;
            details.push(paymentDetail);
        }
        this.payment.details = details;
        this.announcePayment();
    }

    defer(): Observable<any> {
        return this.payDataService.defer(this.payment);
    }

    loadPayment(id) {
        console.log(`Загрузка платежа ID ${id}`);
        this.payment = null;
        return new Observable<Payment>(observer => {
            this.payDataService.get(id).subscribe(
                data => {
                    this.payment = data;
                    observer.next(data);
                },
                error => {
                    observer.error(error);
                },
                () => {
                    observer.complete();
                }
            );
        });
    }

    loadPhones(id) {
        return new Observable<Phone []>(observer => {
            this.clientDataService.phones(id).subscribe(
                data => {
                    this.phones = data;
                    observer.next(data);
                },
                error => {
                    observer.error(error);
                },
                () => {
                    observer.complete();
                }
            );
        });
    }

    validateAccount(profileId, account) {
        return this.payDataService.validateAccount(profileId, account);
    }

    validateMsisdn(profileId, msisdn) {
        return this.payDataService.validateMsisdn(profileId, msisdn);
    }

    validateIcc(profileId, icc) {

    }

    validateNomenclature(profileId, nomenclature) {

    }

    validateDetail(detail: Detail) {

    }

    detailsSum() {
        let total = 0;
        this.payment.details.forEach(detail => {
            total += Number(detail.sum);
        });
        return total;
    }

}
