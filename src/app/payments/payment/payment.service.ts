import {Injectable} from '@angular/core';
import {PaymentsService} from '../payments.service';
import {UploadFilePaymentService} from './equipment/upload-file-payment.service';
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

@Injectable({
    providedIn: 'root',
})
export class PaymentService {

    paymentStatuses = PaymentStatus;
    private paymentObs = new Subject<Payment>();
    paymentAnnounced$ = this.paymentObs.asObservable();

    constructor(private paymentsService: PaymentsService,
                private uploadFilePaymentService: UploadFilePaymentService,
                private logger: NGXLogger,
                private userService: UserService,
                private notifService: NotificationsService,
                private appService: AppService,
                private clientDataService: ClientDataService,
                private payDataService: PayDataService) {
    }

    private _payment: Payment;

    get payment() {
        return this._payment;
    }

    private _phones: Phone [] = [];

    get phones() {
        return this._phones;
    }

    set phones(data) {
        this._phones = data;
    }

    get filePaymentItems() {
        return this.uploadFilePaymentService.filePayment.filePaymentItems;
    }

    get details() {
        return this.payment.details ? this.payment.details : null;
    }

    delAll() {
        this._payment.details = [];
        this.uploadFilePaymentService.resetFilePayment();
        this.announcePayment();
    }

    setPayment(data) {
        this._payment = data;
        this.announcePayment();
    }

    addDetail(detail: Detail) {
        this._payment.details.push(detail);
        this.announcePayment();
    }

    delDetail(row) {
        this._payment.details.splice(this._payment.details.indexOf(row), 1);
        this.announcePayment();
    }

    announcePayment() {
        this.paymentObs.next(this._payment);
    }

    getDetailsSum(key) {
        return this._payment.details.reduce((a, b) => Number(a) + Number((b[key] || 0)), 0);
    }

    /**
     * Сравнение суммы деталей с суммой платежа
     * @returns {boolean} true - равны
     */
    checkTotalSum(): boolean {
        return Number(this.getDetailsSum('sum')) == Number(this._payment.sum);
    }

    checkDocNum(): boolean {
        return this.uploadFilePaymentService.filePayment ? this.uploadFilePaymentService.filePayment.filePaymentHeader.payment_docnum == this._payment.paymentDocnum : true;
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
        this._payment.details = details;
        this.announcePayment();
    }

    checkRnn(): boolean {
        return this.uploadFilePaymentService.filePayment ? this.uploadFilePaymentService.filePayment.filePaymentHeader.iin_bin_sender == this._payment.rnnSender : true;
    }

    distribute() {
        return this.payDataService.distribute(this._payment.id, this._payment.details);
    }

    setEquipments() {
        let details: Detail[] = [];
        this._payment.details.forEach(item => {
            let detail = new Detail();
            detail.icc = detail.icc;
            detail.msisdn = detail.msisdn;
            detail.nomenclature = detail.nomenclature;
            details.push(detail);
        });
        this._payment.details = details;
        this.announcePayment();
    }

    setEquipmentsInDetails(equipments: Equipment []) {
        equipments.forEach(equipment => {
            let detail = this._payment.details.find(x => x.id == equipment.paymentDetailId);
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
                        if (data.result == rests.restResultOk) {
                            this.setEquipmentsInDetails(data.data);
                        }
                        if (data.result == rests.restResultErr) {
                            observer.error(data);
                        }
                    },
                    error2 => {
                    },
                    () => {
                    }
                );
            });
    }

    isBlocked(): boolean {
        let b;
        this._payment ?  b = this._payment.status == PaymentStatus.STATUS_DISTRIBUTED ||
                this._payment.status == PaymentStatus.STATUS_EXPIRED ||
                this._payment.status == PaymentStatus.STATUS_DELETED ||
                this._payment.status == PaymentStatus.STATUS_DEFERRED ||
                this._payment.status == PaymentStatus.STATUS_TRANSIT_DISTRIBUTED ||
                this._payment.status != PaymentStatus.STATUS_TRANSIT : true;
        return b;
    }

    isCurrentSumValid(): boolean {
        return this.getDetailsSum('sum') == this._payment.sum;
    }

    getBercutEquipmentInfo(icc): Observable<any> {
        console.log('Получение информации оборудования по ICC ' + icc + '..');
        return new Observable(
            observer => {
                this.payDataService.bercutEquipmentInfoByIcc(icc).subscribe(
                    data => {
                        if (data.result == rests.restResultOk) {
                            //console.log(data.data);
                            observer.next(data.data);
                        }
                        if (data.result == rests.restResultErr) {
                            observer.error(data);
                        }
                    },
                    error2 => {
                        observer.error(error2);
                    },
                    () => {
                        observer.complete();
                    }
                );
            });
    }

    async checkEquipmentParams(equipmentParams) {
        const response = await this.payDataService.checkEquipmentParams(equipmentParams).toPromise();
        return response;
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
        if (this.uploadFilePaymentService.filePayment)
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
        if (this._payment.details.length > 0) {
            this._payment.details.forEach(detail => {
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
            let res = await this.checkEquipmentParams(equipmentCheckParams);
            res.data.forEach(item => {
                if (item.status != STATUSES.STATUS_VALID && item.status != STATUSES.STATUS_UNKNOWN) {
                    this.notifService.warn(item.icc + ' ' + item.info);
                    result = false;
                }
            });
        }
        return result;
    }

    isNewDetailsExistsForDistribution(): boolean {
        let result = false;
        this._payment.details.forEach(detail => {
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
                this.validateAccount(this._payment.profileId, registry.account) :
                this.validateMsisdn(this._payment.profileId, registry.msisdn));
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
        this._payment.details = details;
        this.announcePayment();
    }

    defer(): Observable<any> {
        return this.payDataService.defer(this._payment);
    }

    loadPayment(id) {
        return new Observable <Payment>(observer => {
            this.payDataService.get(id).subscribe(
                data => {
                    this._payment = data;
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
        return new Observable <Phone []>(observer => {
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

    validateAccount(profileId, account)   {
        return this.payDataService.validateAccount(profileId, account);
    }

    validateMsisdn(profileId, msisdn)  {
        return this.payDataService.validateMsisdn(profileId, msisdn);
    }

    validateIcc(profileId, icc)   {

    }

    validateNomenclature(profileId, nomenclature)  {

    }

    validateDetail(detail: Detail)    {

    }

}
