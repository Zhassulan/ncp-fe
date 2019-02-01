import {Injectable} from '@angular/core';
import {NcpPayment} from '../model/ncp-payment';
import {PaymentsService} from '../payments.service';
import {Observable, Subject} from 'rxjs';
import {Operation} from './operations/model/operation';
import {UploadFilePaymentService} from '../../equipment/upload-file-payment.service';
import {msgs, PaymentDistrStrategy, PaymentStatus, prepaid, rests} from '../../settings';
import {FilePaymentItem} from '../../equipment/model/file-payment-item';
import {DataService} from '../../data/data.service';
import {NGXLogger} from 'ngx-logger';
import {UserService} from '../../user/user.service';
import {PaymentParam} from '../model/payment-param';
import {PaymentDetail} from '../model/payment-detail';
import {logger} from 'codelyzer/util/logger';

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
                private userService: UserService) {
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
            this.addNewDetail(detail);
        }
    }

    determineDistrStrategy(item: FilePaymentItem)    {
        if (item.nomenclature.trim().toLowerCase().includes(prepaid.toLowerCase()) && (item.account == '' || item.account == null))   {
            return PaymentDistrStrategy.byMsisdn;
        }   else
            return PaymentDistrStrategy.byAccount;
    }

    determineDistrStrategyByDetail(detail: PaymentDetail)    {
        return (detail.account == null && detail.msisdn != null) ? PaymentDistrStrategy.byMsisdn : PaymentDistrStrategy.byAccount;
    }

    getPaymentDetails(paymentId): Observable<any> {
        return new Observable(
            observer => {
                this.dataService.getPaymentDetails(paymentId).subscribe(data => {
                        if (data.result == rests.restResultOk)  {
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
                        if (data.result == rests.restResultErrDb)   {
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

    addDetailsToOperations()    {
        this.details.forEach(item => {
            this.addOperation(null, item.msisdn, null, item.account, item.sum, PaymentDistrStrategy.None);
        });
    }

    distribute(): Observable<any>    {
        this.preparePaymentParams();
        return new Observable<any>( observer => {
            this.dataService.distributePayment(this.paymentParam).subscribe(data => {
                observer.next(data);
            }, error2 => {
                let msg = msgs.msgErrDistributePayment + error2 + this.userService.logUser();
                this.logger.error(msg);
                observer.error(msgs.msgErrDistributePayment);
            }, () => {
                observer.complete();
            })
        });
    }

    preparePaymentParams()  {
        let params: PaymentParam = new PaymentParam();
        params.id = this.payment.id;
        params.profileId = this.payment.profileId;
        params.items = this.details;
        this.paymentParam = params;
    }

}
