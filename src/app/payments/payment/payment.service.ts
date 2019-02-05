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

@Injectable()
export class PaymentService {

    payment: NcpPayment;
    details: PaymentDetail [] = [];
    operations: Operation [] = [];
    private operationsObs = new Subject<Operation[]>();
    private detailsObs = new Subject<PaymentDetail[]>();
    operationsAnnounced$ = this.operationsObs.asObservable();
    detailsAnnounced$ = this.detailsObs.asObservable();
    paymentParam: PaymentParam;

    constructor(private paymentsService: PaymentsService,
                private uploadFilePaymentService: UploadFilePaymentService,
                private dataService: DataService,
                private logger: NGXLogger,
                private userService: UserService,
                private myNotifService: NotifService) {
    }

    setPayment(id) {
        this.payment = this.paymentsService.payments.find(x => x.id == id);
    }

    addOperation(nomenclature, msisdn, icc, account, sum, distrStrategy) {
        this.operations.push({
            nomenclature: nomenclature,
            msisdn: msisdn,
            icc: icc,
            account: account,
            sum: sum,
            distrStrategy: distrStrategy,
        });
        this.announceOperations();
    }

    addNewDetail(detail: PaymentDetail) {
        this.details.push(detail);
        this.announceDetails();
    }

    delDetail(row) {
        this.details.splice(this.details.indexOf(row), 1);
    }

    delOperation(row) {
        this.operations.splice(this.operations.indexOf(row), 1);
    }

    announceOperations() {
        this.operationsObs.next(this.operations);
    }

    announceDetails() {
        this.detailsObs.next(this.details);
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

    getOperationsFromUploadService() {
        for (let item of this.items.slice(0, this.items.length - 1)) {
            this.addOperation(item.nomenclature, item.msisdn, item.icc, item.account, item.sum, this.determineDistrStrategy(item));
        }
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
            this.addNewDetail(detail);
        }
        //this.printDetails();
        this.checkFilePayment();
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

    printDetails()  {
        console.log('Details after adding from file payment:\n');
        console.log('------------------------');
        this.details.forEach(item => {
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

    getPaymentDetails(paymentId): Observable<any> {
        return new Observable(
            observer => {
                this.dataService.getPaymentDetails(paymentId).subscribe(data => {
                        if (data.result == rests.restResultOk) {
                            this.details = [];
                            data.data.forEach(item => {
                                let detail = new PaymentDetail();
                                detail.id = item.id;
                                detail.msisdn = item.msisdn;
                                detail.account = item.account;
                                detail.sum = item.sum;
                                detail.status = item.status;
                                detail.err_message = item.err_message;
                                detail.distribute_date = item.distribute_date;
                                detail.distrStrategy = PaymentDistrStrategy.None;
                                this.details.push(detail);
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

    addDetailsToOperations() {
        this.details.forEach(item => {
            this.addOperation(null, item.msisdn, null, item.account, item.sum, PaymentDistrStrategy.None);
        });
    }

    distribute(): Observable<any> {
        this.preparePaymentParams();
        return this.dataService.distributePayment(this.paymentParam);
    }


    preparePaymentParams() {
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

    getPaymentData(id): Observable<any> {
        return new Observable(
            observer => {
                this.dataService.getPayment(id).subscribe(
                    data => {
                        if (data.result == rests.restResultOk)  {
                            this.payment = data.data;
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

}
