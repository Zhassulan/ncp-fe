import {Injectable} from '@angular/core';
import {NcpPayment} from '../model/ncp-payment';
import {PaymentsService} from '../payments.service';
import {Observable, Subject} from 'rxjs';
import {Operation} from './operations/model/operation';
import {UploadFilePaymentService} from '../../equipment/upload-file-payment.service';
import {msgs, msgType, PaymentDistrStrategy, PaymentStatus, prepaid, rests} from '../../settings';
import {FilePaymentItem} from '../../equipment/model/file-payment-item';
import {DataService} from '../../data/data.service';
import {NGXLogger} from 'ngx-logger';
import {UserService} from '../../user/user.service';
import {PaymentParam} from '../model/payment-param';
import {PaymentDetail} from '../model/payment-detail';
import {NcpPaymentDetails} from '../model/ncp-payment-details';
import {Equipment} from '../model/equipment';
import {NotifService} from '../../notif/notif-service.service';
import {PaymentParamEq} from '../model/payment-param-eq';
import {DetailEquipment} from '../model/detail-equipment';

@Injectable()
export class PaymentService {

    payment: NcpPayment;
    details: PaymentDetail [] = [];
    operations: Operation [] = [];
    equipments: Equipment [] = [];
    private detailsObs = new Subject<PaymentDetail[]>();
    private paymentObs = new Subject<NcpPayment>();
    detailsAnnounced$ = this.detailsObs.asObservable();
    paymentAnnounced$ = this.paymentObs.asObservable();
    paymentParam: PaymentParam;
    paymentParamEq: PaymentParamEq;

    constructor(private paymentsService: PaymentsService,
                private uploadFilePaymentService: UploadFilePaymentService,
                private dataService: DataService,
                private logger: NGXLogger,
                private userService: UserService,
                private myNotifService: NotifService) {
    }

    setPayment(id) {
        this.payment = this.paymentsService.payments.find(x => x.id == id);
        console.log('Выбран платёж ID ' + this.payment.id);
        this.announcePayment();
    }

    print(obj)  {
        console.log(JSON.stringify(obj));
    }

    setPaymentByPayment(payment: NcpPayment)   {
        this.payment = payment;
        this.announcePayment();
    }

    setPaymentStatus(status: number)  {
        this.payment.status = status;
        this.announcePayment();
    }

    addNewDetail(detail: PaymentDetail) {
        this.details.push(detail);
        this.announceDetails();
    }

    delDetail(row) {
        this.details.splice(this.details.indexOf(row), 1);
        this.announceDetails();
    }

    delOperation(row) {
        this.operations.splice(this.operations.indexOf(row), 1);
    }

    announceDetails() {
        this.detailsObs.next(this.details);
    }

    announcePayment() {
        this.paymentObs.next(this.payment);
    }

    get items() {
        return this.uploadFilePaymentService.filePayment.filePaymentItems;
    }

    checkTotalSum(): boolean {
        return Number(this.items.slice(this.items.length - 1)[0].sum) == Number(this.payment.sum);
    }

    checkDocNum(): boolean {
        return this.uploadFilePaymentService.filePayment.filePaymentHeader.payment_docnum == this.payment.paymentDocnum;
    }

    checkRnn(): boolean {
        return this.uploadFilePaymentService.filePayment.filePaymentHeader.iin_bin_sender == this.payment.rnnSender;
    }

    addDetailsFromFilePayment() {
        for (let item of this.items.slice(0, this.items.length - 1)) {
            let detail = new PaymentDetail();
            detail.nomenclature = item.nomenclature;
            detail.msisdn = item.msisdn;
            detail.icc = item.icc;
            detail.account = item.account;
            detail.sum = item.sum;
            detail.distrStrategy = this.determineDistrStrategy(item);
            detail.status = 0;
            detail.num = item.num;
            this.addNewDetail(detail);
        }
        this.announceDetails();
        this.checkFilePayment();
        this.setEquipments();
    }

    checkFilePayment()  {
        if (!this.checkTotalSum()) {
            this.myNotifService.add(msgType.warn, msgs.msgErrTotalSum);
        }
        if (!this.checkDocNum()) {
            this.myNotifService.add(msgType.warn, msgs.msgErrDocNum);
        }
        if (!this.checkRnn()) {
            this.myNotifService.add(msgType.warn, msgs.msgErrRnn);
        }
    }

    printDetails(details)  {
        console.log('Details after adding from file payment:\n');
        console.log('------------------------');
        details.forEach(item => {
           console.log(item);
        });
        console.log('------------------------');
    }

    determineDistrStrategy(item: FilePaymentItem) {
        if (item.nomenclature.trim().toLowerCase().includes(prepaid.toLowerCase()) && (item.account == null || item.account == '')) {
            return PaymentDistrStrategy.byMsisdn;
        } else
            return PaymentDistrStrategy.byAccount;
    }

    determineDistrStrategyByDetail(detail: PaymentDetail) {
        return (detail.account == null && (detail.msisdn != null || detail.msisdn != '')) ? PaymentDistrStrategy.byMsisdn : PaymentDistrStrategy.byAccount;
    }

    convertDbDetailToAppDetail(item: NcpPaymentDetails):PaymentDetail {
        let detail = new PaymentDetail();
        detail.id = item.id;
        detail.msisdn = item.msisdn;
        detail.account = item.account;
        detail.sum = item.sum;
        detail.status = item.status;
        detail.err_message = item.err_message;
        detail.distribute_date = item.distribute_date;
        detail.nomenclature = null;
        detail.icc = null;
        detail.distrStrategy = PaymentDistrStrategy.None;
        return detail;
    }

    setDetailsFromDbDetails(details: NcpPaymentDetails [])   {
        this.details = [];
        details.forEach(item => {
            this.details.push(this.convertDbDetailToAppDetail(item));
        })
    }

    getPaymentDetails(paymentId): Observable<any> {
        return new Observable(
            observer => {
                this.dataService.getPaymentDetails(paymentId).subscribe(data => {
                        if (data.result == rests.restResultOk) {
                            this.details = [];
                            data.data.forEach(item => {
                                this.details.push(this.convertDbDetailToAppDetail(item));
                            });
                            this.getPaymentEquipments(this.payment.id).subscribe(
                                data => {
                                observer.next()
                                },
                                error2 => {
                                observer.error(error2);
                                });
                            this.announceDetails();
                            observer.next();
                        }
                        if (data.result == rests.restResultErrDb) {
                            this.logger.error(data.data);
                            observer.error(msgs.msgErrGetDetails);
                        }
                    },
                    error2 => {
                        let msg = msgs.msgErrGetDetails + error2 + this.userService.logUser();
                        this.logger.error(msg);
                        observer.error(msgs.msgErrGetDetails);
                    },
                    () => {
                        observer.complete();
                    });
            });
    }

    distribute(): Observable<any> {
        this.preparePaymentParams();
        return this.dataService.distributePayment(this.paymentParamEq);
    }


    preparePaymentParamsOld() {
        let params: PaymentParam = new PaymentParam();
        params.id = this.payment.id;
        params.profileId = this.payment.profileId;
        params.items = [];
        this.details.forEach(detail => {
            let ncpDetail = new NcpPaymentDetails();
            ncpDetail.id = detail.id;
            ncpDetail.msisdn = detail.msisdn;
            ncpDetail.account = detail.account;
            ncpDetail.sum = detail.sum;
            if (detail.distrStrategy == PaymentDistrStrategy.byAccount) {
                ncpDetail.msisdn = null;
            }
            if (detail.distrStrategy == PaymentDistrStrategy.byMsisdn) {
                ncpDetail.account = null;
            }
            ncpDetail.status = detail.status;
            ncpDetail.err_message = detail.err_message;
            ncpDetail.distribute_date = detail.distribute_date;
            params.items.push(ncpDetail);
        })
        this.paymentParam = params;
    }

    preparePaymentParams() {
        let params: PaymentParamEq = new PaymentParamEq();
        params.id = this.payment.id;
        params.profileId = this.payment.profileId;
        params.items = [];
        this.details.forEach(detail => {
            let ncpDetail = new NcpPaymentDetails();
            ncpDetail.id = detail.id;
            ncpDetail.msisdn = detail.msisdn;
            ncpDetail.account = detail.account;
            ncpDetail.sum = detail.sum;
            if (detail.distrStrategy == PaymentDistrStrategy.byAccount) {
                ncpDetail.msisdn = null;
            }
            if (detail.distrStrategy == PaymentDistrStrategy.byMsisdn) {
                ncpDetail.account = null;
            }
            ncpDetail.status = detail.status;
            ncpDetail.err_message = detail.err_message;
            ncpDetail.distribute_date = detail.distribute_date;
            let equipment: Equipment = this.createEquipmentByDetail(this.payment.id, detail);
            params.items.push(new DetailEquipment(ncpDetail, equipment));
        })
        this.paymentParamEq = params;
    }

    getPaymentData(id): Observable<any> {
        return new Observable(
            observer => {
                this.dataService.getPayment(id).subscribe(
                    data => {
                        if (data.result == rests.restResultOk)  {
                            this.payment = data.data;
                            this.announcePayment();
                        }
                        if (data.result == rests.restResultErrDb)  {
                            observer.error(data);
                        }
                    },
                    error2 => {},
                ()=> {}
                )
            });
    }

    newEquipment(paymentId: number, equipment: Equipment)  {
        return this.dataService.newEquipment(paymentId, equipment);
    }

    createEquipmentByDetail(paymentId: number, detail: PaymentDetail):Equipment   {
        let eq: Equipment = new Equipment();
        eq.icc = detail.icc;
        eq.msisdn = detail.msisdn;
        eq.nomenclature = detail.nomenclature;
        eq.paymentDetailId = paymentId;
        return eq;
    }

    setEquipments() {
        this.equipments = [];
        this.details.forEach(item => {
           this.equipments.push(this.createEquipmentByDetail(this.payment.id, item));
        });
    }

    setEquipmentsInDetails(equipments: Equipment [])    {
        equipments.forEach(equipment => {
            let detail = this.details.find(x => x.id == equipment.paymentDetailId);
            detail.id = equipment.id;
            detail.nomenclature = equipment.nomenclature;
            detail.msisdn = equipment.msisdn;
            detail.icc = equipment.icc;
        });
    }

    getPaymentEquipments(id: number): Observable<any> {
        return new Observable(
            observer => {
                this.dataService.getPaymentEquipments(id).subscribe(
                    data => {
                        if (data.result == rests.restResultOk)  {
                            this.setEquipmentsInDetails(data.data);
                        }
                        if (data.result == rests.restResultErrDb)  {
                            observer.error(data);
                        }
                    },
                    error2 => {},
                    ()=> {}
                )
            });
    }

    isBlocked():boolean  {
        let res: boolean =
            this.payment.status == PaymentStatus.STATUS_DISTRIBUTED ||
            this.payment.status == PaymentStatus.STATUS_EXPIRED ||
            this.payment.status == PaymentStatus.STATUS_DELETED;
        return res;
    }

    isCurrentSumValid():boolean  {
        console.log('Сравнивается суммы ' + this.getDetailsSum() + ' == ' + this.payment.sum);
        return this.getDetailsSum() == this.payment.sum;
    }

    getDetailsSum(): number {
        let sum = 0;
        this.details.forEach(detail => {
            sum += Number(detail.sum);
        })
        return sum;
    }


}
