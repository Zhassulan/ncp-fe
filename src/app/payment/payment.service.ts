import {Injectable} from '@angular/core';
import {PaymentStatus} from '../settings';
import {Observable, Subject} from 'rxjs';
import {Payment} from './model/payment';
import {Detail} from './model/detail';
import {ClientRepository} from '../clients/client-repository';
import {PaymentRepository} from './paymet-repository';
import {RouterService} from '../router/router.service';
import {NotificationsService} from 'angular2-notifications';
import {Message} from '../message';
import {Template} from '../template/model/template';
import {TemplateService} from '../template/template.service';

class Props {

  count: number;

  constructor(count: number) {
    this.count = count;
  }
}

@Injectable()
export class PaymentService {

  payment: Payment;
  private paymentObs = new Subject<Payment>();
  payAnnounced$ = this.paymentObs.asObservable();
  props = new Props(0);
  private propsObs = new Subject<Props>();
  propsAnnounced$ = this.propsObs.asObservable();
  templateId: number;

  constructor(private routerService: RouterService,
              private clntDataService: ClientRepository,
              private payDataService: PaymentRepository,
              private notifSerice: NotificationsService,
              private templateService: TemplateService) {
  }

  get routerRegistryItems() {
    return this.routerService.routerRegistry.items;
  }

  get details() {
    return this.payment.details ? this.payment.details : null;
  }

  delAll() {
    this.payment.details = this.payment.details.filter(i =>
      i.status !== PaymentStatus.NEW &&
      i.status !== PaymentStatus.ERR &&
      i.status !== PaymentStatus.TRANSIT_ERR);
    this.routerService.resetFilePayment();
    this.announcePayment();
  }

  setPayment(data) {
    this.payment = data;
    if (this.templateId) {
      this.templateService.findById(this.templateId).subscribe({
        next: (res) => this.loadRegistryFromTemplate(res),
        error: (err) => this.notifSerice.error(err),
        complete: () => this.announcePayment()
      });
    }
  }

  /*addDetail(detail: Detail) {
      this.payment.details.push(detail);
      this.announcePayment();
  }*/

  addDetail(phone, account, sum) {
    const detail = new Detail();
    detail.paymentId = this.payment.id;
    phone === '' || phone == null ? detail.msisdn = null : detail.msisdn = phone;
    account === '' || account == null ? detail.account = null : detail.account = Number(account);
    sum = sum.replace(',', '.');
    sum = sum.trim();
    sum = sum.replace(/[\r\n\t\f\v ]/, '');
    if (isNaN(Number(sum))) {
      this.notifSerice.warn(Message.WAR.INPUT_NUMBER);
      return;
    }
    detail.sum = Number(sum);
    detail.status = PaymentStatus.NEW;
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

  announceProps() {
    this.propsObs.next(this.props);
  }

  json_pretty(data) {
    return JSON.stringify(data, undefined, 3);
  }

  addDetailsFromRouterRegistry() {
    const details: Detail [] = [];
    for (const item of this.routerRegistryItems.slice(0, this.routerRegistryItems.length)) {
      const detail = new Detail();
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
    const details: Detail[] = [];
    this.payment.details.forEach(detail => {
      const newDetail = new Detail();
      newDetail.icc = detail.icc;
      newDetail.msisdn = detail.msisdn;
      newDetail.nomenclature = detail.nomenclature;
      details.push(newDetail);
    });
    this.payment.details = details;
    this.announcePayment();
  }

  isBlocked(): boolean {
    return this.payment.status === PaymentStatus.DISTRIBUTED ||
      this.payment.status === PaymentStatus.EXPIRED ||
      this.payment.status === PaymentStatus.DELETED ||
      this.payment.status === PaymentStatus.DEFERRED ||
      this.payment.status === PaymentStatus.TRANSIT_DISTRIBUTED ||
      this.payment.status === PaymentStatus.TRANSIT;
  }

  canPasteRegistryFromBuffer() {
    return this.payment.status === PaymentStatus.NEW ||
      this.payment.status === PaymentStatus.TRANSIT ||
      this.payment.status === PaymentStatus.ERR ||
      this.payment.status === PaymentStatus.TRANSIT_ERR ||
      this.payment.status === PaymentStatus.TRANSIT_CANCELLED ||
      this.payment.mobipay === false;
  }

  canLoadEquipment() {
    return this.payment.status === PaymentStatus.NEW ||
      this.payment.status === PaymentStatus.TRANSIT ||
      this.payment.status === PaymentStatus.ERR ||
      this.payment.status === PaymentStatus.TRANSIT_ERR ||
      this.payment.status === PaymentStatus.TRANSIT_CANCELLED;
  }

  canTransit() {
    return this.payment.status === PaymentStatus.NEW ||
      this.payment.status === PaymentStatus.TRANSIT_CANCELLED;
  }

  canDelTransit() {
    return this.payment.status === PaymentStatus.TRANSIT;
  }

  canDefer() {
    return (this.payment.status === PaymentStatus.NEW ||
        this.payment.status === PaymentStatus.ERR ||
        this.payment.status === PaymentStatus.TRANSIT_CANCELLED) &&
      this.payment.details.filter(i => i.status === PaymentStatus.NEW).length > 0 &&
      this.detailsSum() === this.payment.sum;
  }

  canLoadPhones(payment) {
    return payment ? payment.status === PaymentStatus.NEW ||
      payment.status === PaymentStatus.ERR ||
      payment.status === PaymentStatus.TRANSIT ||
      payment.status === PaymentStatus.TRANSIT_CANCELLED ||
      payment.status === PaymentStatus.TRANSIT_ERR : false;
  }

  canAddDetail() {
    return this.payment ? this.payment.status === PaymentStatus.NEW ||
      this.payment.status === PaymentStatus.TRANSIT ||
      this.payment.status === PaymentStatus.ERR ||
      this.payment.status === PaymentStatus.TRANSIT_CANCELLED ||
      this.payment.status === PaymentStatus.TRANSIT_ERR : false;
  }

  canDistribute() {
    return (this.payment.status === PaymentStatus.NEW ||
        this.payment.status === PaymentStatus.TRANSIT ||
        this.payment.status === PaymentStatus.ERR ||
        this.payment.status === PaymentStatus.TRANSIT_CANCELLED ||
        this.payment.status === PaymentStatus.TRANSIT_ERR) &&
      this.payment.details.filter(i => i.status === PaymentStatus.NEW).length > 0 &&
      this.detailsSum() === this.payment.sum;
  }

  canDel() {
    return this.payment ? this.payment.status === PaymentStatus.DISTRIBUTED ||
      this.payment.status === PaymentStatus.TRANSIT : false;
  }

  importRegistryData(rawdata) {
    let details = [];
    const rows = rawdata.split('\n');
    const brokenRows = [];
    if (rows.length) {
      details = [];
    }
    for (const row of rows) {
      if (row === '\n' || row === '' || row.trim() === '' || row.replace('\t', '') === '') {
        continue;
      }
      const parts = row.split('\t');
      if (parts.length === 2) {
        const detail = new Detail();
        detail.status = PaymentStatus.NEW;
        let b = true;
        isNaN(parts[0]) ? b = false : this.isMSISDN(parts[0]) ? detail.msisdn = parts[0] : detail.account = parts[0];
        isNaN(parts[1]) ? b = false : detail.sum = parts[1];
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

  addImportedRegistriesPayment(importedRegistry) {
    const details: Detail [] = [];
    for (const paymentDetail of importedRegistry) {
      paymentDetail.status = PaymentStatus.NEW;
      details.push(paymentDetail);
    }
    this.payment.details = details;
    this.announcePayment();
  }

  loadPayment(id) {
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
    return this.payment.details.reduce((total, detail) => total + Number(detail.sum), 0);
  }

  sumByDetails(details) {
    return details.reduce((total, detail) => total + Number(detail.sum), 0);
  }

  canDelSome() {
    return this.payment.details.filter(i => i.status === PaymentStatus.NEW).length > 0 || this.payment.details
      .filter(detail => detail.status === PaymentStatus.ERR || detail.status === PaymentStatus.TRANSIT_ERR).length > 0;
  }

  canDelDetail(detail) {
    return detail.status === PaymentStatus.NEW ||
      detail.status === PaymentStatus.ERR ||
      detail.status === PaymentStatus.TRANSIT_ERR;
  }

  loadRegistryFromTemplate(template: Template) {
    this.payment.details = [];
    template.details.forEach(detail => {
      const paymentDetail = new Detail();
      paymentDetail.account = detail.account;
      paymentDetail.msisdn = detail.msisdn;
      paymentDetail.sum = detail.sum;
      paymentDetail.status = PaymentStatus.NEW;
      this.payment.details.push(paymentDetail);
    });
  }
}
