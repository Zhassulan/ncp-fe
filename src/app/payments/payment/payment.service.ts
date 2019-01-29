import {Injectable} from '@angular/core';
import {NcpPayment} from './model/ncp-payment';
import {PaymentsService} from '../payments.service';
import {Subject} from 'rxjs';
import {Operation} from './operations/model/operation';
import {UploadFilePaymentService} from '../../equipment/upload-file-payment.service';
import {msgs, PaymentDistrStrategy, prepaid} from '../../settings';
import {FilePaymentItem} from '../../equipment/model/file-payment-item';
import {NotificationsService} from 'angular2-notifications';

@Injectable()
export class PaymentService {

    payment: NcpPayment;
    operations = [];
    private operationsObs = new Subject<Operation[]>();
    operationsAnnounced$ = this.operationsObs.asObservable();

    constructor(private paymentsService: PaymentsService,
                private uploadFilePaymentService: UploadFilePaymentService) {
    }

    setPayment(id) {
        this.payment = this.paymentsService.payments.find(x => x.id == id);
    }

    addOperation(nomenclature, phone, icc, account, sum, distrStrategy) {
        this.operations.push({
            nomenclature: nomenclature,
            phone: phone,
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
        if (this.items.slice(this.items.length - 1)[0].sum != this.payment.sum) return false; else return true;
    }

    checkDocNum(): boolean {
        if (this.uploadFilePaymentService.filePayment.filePaymentHeader.payment_docnum != this.payment.paymentDocnum)
            return false; else return true;
    }

    checkRnn(): boolean {
        if (this.uploadFilePaymentService.filePayment.filePaymentHeader.iin_bin_sender != this.payment.rnnSender)
            return false; else return true;
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

    distribute()    {

    }

}
