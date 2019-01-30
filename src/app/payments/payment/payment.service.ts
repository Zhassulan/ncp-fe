import {Injectable} from '@angular/core';
import {NcpPayment} from './model/ncp-payment';
import {PaymentsService} from '../payments.service';
import {Observable, Subject} from 'rxjs';
import {Operation} from './operations/model/operation';
import {UploadFilePaymentService} from '../../equipment/upload-file-payment.service';
import {msgs, PaymentDistrStrategy, prepaid, rests} from '../../settings';
import {FilePaymentItem} from '../../equipment/model/file-payment-item';
import {DataService} from '../../data/data.service';
import {NGXLogger} from 'ngx-logger';
import {UserService} from '../../user/user.service';
import {PaymentDetail} from './model/payment-detail';
import {RestResponse} from '../../data/rest-response';

@Injectable()
export class PaymentService {

    payment: NcpPayment;
    details = [];
    operations = [];
    private operationsObs = new Subject<Operation[]>();
    operationsAnnounced$ = this.operationsObs.asObservable();

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
            distrStrategy: distrStrategy
        });
        this.announceOperations();
    }

    /*
    addOperation(phone, account, sum) {
        this.operations.push({
            phone: phone,
            account: account,
            sum: sum,
        });
        this.announceOperations();
    }
    */

    delOperation(row) {
        this.operations.splice(this.operations.indexOf(row), 1);
    }

    announceOperations() {
        this.operationsObs.next(this.operations);
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

    determineDistrStrategy(item: FilePaymentItem)    {
        if (item.nomenclature.trim().toLowerCase().includes(prepaid.toLowerCase()) && (item.account == '' || item.account == null))   {
            return PaymentDistrStrategy.byMsisdn;
        }   else
            return PaymentDistrStrategy.byAccount;
    }

    getDetails(paymentId): Observable<any> {
        return new Observable(
            observer => {
                this.dataService.getPaymentDetails(paymentId).subscribe(data => {
                    if (data.result == rests.restResultOk)  {
                        this.details = data.data;
                        this.addDetailsToOperations();
                        observer.next(this.details);
                    }
                    if (data.result == rests.restResultErrDb)   {
                        this.logger.error(data.data);
                        observer.error(msgs.msgErrGetDetails);
                    }
                    },
                    error2 => {
                        let msg = msgs.msgErrGetDetails + error2 + this.userService.logUser();
                        this.logger.error(msg);
                        observer.error(msg);
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

    distribute()    {

    }

}
