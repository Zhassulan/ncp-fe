import {Injectable} from '@angular/core';
import {PaymentStatus} from '../../settings';
import {PaymentDetail} from '../model/payment-detail';
import {NcpPaymentDetails} from '../model/ncp-payment-details';
import {Equipment} from '../model/equipment';
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

    payment: Payment;
    private paymentObs = new Subject<Payment>();
    payAnnounced$ = this.paymentObs.asObservable();

    constructor(private routerService: RouterService,
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
        this.payment = data
        this.announcePayment()
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
            this.payDataService.findById(id).subscribe(
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

    validateAccount(profileId, account) {
        return this.payDataService.validateAccount(profileId, account);
    }

    validateMsisdn(profileId, msisdn) {
        return this.payDataService.validateMsisdn(profileId, msisdn);
    }

    detailsSum() {
        return this.payment.details.reduce((prevVal, elem) => prevVal + Number(elem.sum), 0);
    }

}
