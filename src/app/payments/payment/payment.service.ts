import {Injectable} from '@angular/core';
import {NcpPayment} from '../../model/ncp-payment';
import {PaymentsService} from '../payments.service';
import {Observable, Subject} from 'rxjs';
import {Operation} from './operations/model/operation';

@Injectable()
export class PaymentService {

    payment: NcpPayment;
    operations = [];
    total: number = 0;
    private operationsObs = new Subject< Operation [] >();
    operationsAnnounced$ = this.operationsObs.asObservable();

    constructor(private paymentsService: PaymentsService) {
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
        this.refreshTotal();
        this.getOperations();
    }


    delOperation(row) {
        this.operations.splice(this.operations.indexOf(row), 1);
        this.refreshTotal();
    }

    refreshTotal() {
        this.total = 0;
        this.operations.forEach(operation => {
            this.total += operation.sum;
        });
    }

    getOperations() {
        this.operationsObs.next(this.operations);
    }

}
