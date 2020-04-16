import {Injectable} from '@angular/core';
import {PaymentStatus, PaymentStatusRu} from '../../settings';
import {PaymentDetail} from '../model/payment-detail';
import {NcpPaymentDetails} from '../model/ncp-payment-details';
import {Equipment} from '../model/equipment';
import {DialogService} from '../../dialog/dialog.service';
import {from, Observable, Subject} from 'rxjs';
import {concatAll} from 'rxjs/operators';
import {Payment} from './model/payment';
import {Detail} from './model/detail';
import {ClientDataService} from '../../data/client-data-service';
import {PayDataService} from '../../data/pay-data-service';
import {RouterService} from '../../router/router.service';
import {AppService} from '../../app.service';

@Injectable()
export class PaymentService {

    payment;
    paymentObs = new Subject<Payment>();
    payAnnounced$ = this.paymentObs.asObservable();

    constructor(private routerService: RouterService,
                private clientDataService: ClientDataService,
                private payDataService: PayDataService,
                private appService: AppService) {
    }

    get routerRegistryItems() {
        return this.routerService.routerRegistry.items;
    }

    get details() {
        return this.payment.details ? this.payment.details : null;
    }

    delAll() {
        this.payment.details = this.payment.details.filter(i =>
            i.status != PaymentStatus.NEW &&
            i.status != PaymentStatus.ERROR &&
            i.status != PaymentStatus.TRANSIT_ERROR);
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

    json_pretty(data) {
        return JSON.stringify(data, undefined, 3);
    }

    addDetailsFromRouterRegistry() {
        let details: Detail [] = [];
        for (let item of this.routerRegistryItems.slice(0, this.routerRegistryItems.length)) {
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
        return this.payment.status == PaymentStatus.DISTRIBUTED ||
            this.payment.status == PaymentStatus.EXPIRED ||
            this.payment.status == PaymentStatus.DELETED ||
            this.payment.status == PaymentStatus.DEFERRED ||
            this.payment.status == PaymentStatus.TRANSIT_DISTRIBUTED ||
            this.payment.status == PaymentStatus.TRANSIT;
    }

    canPasteRegistryFromBuffer() {
        return this.payment.status == PaymentStatus.NEW ||
            this.payment.status == PaymentStatus.TRANSIT ||
            this.payment.status == PaymentStatus.ERROR ||
            this.payment.status == PaymentStatus.TRANSIT_ERROR ||
            this.payment.status == PaymentStatus.TRANSIT_CANCELLED ||
            this.payment.mobipay == false;
    }

    canLoadEquipment() {
        return this.payment.status == PaymentStatus.NEW ||
            this.payment.status == PaymentStatus.TRANSIT ||
            this.payment.status == PaymentStatus.ERROR ||
            this.payment.status == PaymentStatus.TRANSIT_ERROR ||
            this.payment.status == PaymentStatus.TRANSIT_CANCELLED;
    }

    canTransit() {
        return this.payment.status == PaymentStatus.NEW ||
            this.payment.status == PaymentStatus.TRANSIT_CANCELLED;
    }

    canDelTransit() {
        return this.payment.status == PaymentStatus.TRANSIT;
    }

    canDefer() {
        return this.payment.status == PaymentStatus.NEW ||
            this.payment.status == PaymentStatus.ERROR ||
            this.payment.status == PaymentStatus.TRANSIT ||
            this.payment.status == PaymentStatus.TRANSIT_ERROR ||
            this.payment.status == PaymentStatus.TRANSIT_CANCELLED;
    }

    canLoadPhones() {
        return this.payment ? this.payment.status == PaymentStatus.NEW ||
            this.payment.status == PaymentStatus.TRANSIT ||
            this.payment.status == PaymentStatus.TRANSIT_CANCELLED ||
            this.payment.status == PaymentStatus.TRANSIT_ERROR : false;
    }

    canAddDetail() {
        return this.payment ? this.payment.status == PaymentStatus.NEW ||
            this.payment.status == PaymentStatus.TRANSIT ||
            this.payment.status == PaymentStatus.ERROR ||
            this.payment.status == PaymentStatus.TRANSIT_CANCELLED ||
            this.payment.status == PaymentStatus.TRANSIT_ERROR : false;
    }

    canDistribute() {
        return (this.payment.status == PaymentStatus.NEW ||
            this.payment.status == PaymentStatus.TRANSIT ||
            this.payment.status == PaymentStatus.ERROR ||
            this.payment.status == PaymentStatus.TRANSIT_CANCELLED ||
            this.payment.status == PaymentStatus.TRANSIT_ERROR) &&
            this.payment.details.filter(i => i.status == PaymentStatus.NEW).length > 0;
    }

    importRegistryData(rawdata) {
        let details = [];
        let rows = rawdata.split('\n');
        let brokenRows = [];
        if (rows.length) details = [];
        for (let row of rows) {
            if (row === '\n' || row === '' || row.trim() === '' || row.replace('\t', '') === '') continue;
            let parts = row.split('\t');
            if (parts.length === 2) {
                let detail = new Detail();
                detail.status = PaymentStatus.NEW;
                let b = true;
                /*console.log('parts[0] = ' + parts[0]);
                console.log('parts[1] = ' + parts[1]);*/
                isNaN(parts[0]) ? b = false : this.isMSISDN(parts[0]) ? detail.msisdn = parts[0] : detail.account = parts[0];
                isNaN(parts[1]) ? b = false : detail.sum = parts[1];
                //console.log(detail);
                //console.log(details);
                if (detail) {
                    this.payment.details.push(detail);
                    this.announcePayment();
                }
                !b ? brokenRows.push(row) : details.push(detail);
            } else {
                brokenRows.push(row);
            }
        }

        return {'broken': brokenRows, 'imported': details};
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
            paymentDetail.status = PaymentStatus.NEW;
            details.push(paymentDetail);
        }
        this.payment.details = details;
        this.announcePayment();
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

    canDelSome() {
        return this.payment.details.filter(i => i.status == PaymentStatus.NEW).length > 0 || this.payment.details.filter(i => i.status == PaymentStatus.ERROR || i.status == PaymentStatus.TRANSIT_ERROR).length > 0;
    }


}
