import {Injectable} from '@angular/core';
import {NcpPayment} from '../../model/ncp-payment';
import {PaymentsService} from '../payments.service';
import {Observable, Subject} from 'rxjs';
import {Operation} from './operations/model/operation';
import {UploadFilePaymentService} from '../../equipment/upload-file-payment.service';
import {forEach} from '@angular/router/src/utils/collection';

@Injectable()
export class PaymentService {

    payment: NcpPayment;
    operations = [];
    private operationsObs = new Subject<Operation[]>();
    operationsAnnounced$ = this.operationsObs.asObservable();

    constructor(private paymentsService: PaymentsService,
                private uploadFilePaymentService: UploadFilePaymentService) {
    }

    setPayment(id)    {
        this.payment = this.paymentsService.payments.find(x => x.id == id);
    }

    addOperation(phone, account, sum) {
        this.operations.push({
            phone: phone,
            account: account,
            sum: sum,
        });
        this.announceOperations();
    }


    delOperation(row) {
        this.operations.splice(this.operations.indexOf(row), 1);
    }

    announceOperations() {
        this.operationsObs.next(this.operations);
    }

    getOperationsFromUploadService()   {
        for (let item of this.uploadFilePaymentService.filePayment.filePaymentItems)    {
            if (item.msisdn != '' || item.account != '')
                this.addOperation(item.msisdn, item.account, item.sum);
        }
        console.log(this.operations);
        /*
        this.uploadFilePaymentService.filePayment.filePaymentItems.forEach(item => {
            this.addOperation(item.msisdn, item.account, item.sum);
        }, () => {});
        this.delOperationByIndex(this.operations.length);
        */
    }

}
