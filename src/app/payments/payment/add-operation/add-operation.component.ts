import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {msisdnLength} from '../../../settings';
import {PaymentService} from '../payment.service';
import {PaymentDetail} from '../../model/payment-detail';
import {PaymentStatus} from '../../../settings';

@Component({
    selector: 'app-payment-add-operation',
    templateUrl: './add-operation.component.html',
    styleUrls: ['./add-operation.component.css']
})
export class AddOperationComponent implements OnInit {

    frmOperation: FormGroup;
    paymentStatuses = PaymentStatus;

    constructor(private paymentService: PaymentService) {
    }

    ngOnInit() {
        this.frmOperation = new FormGroup({
            msisdn: new FormControl(
                '',
                [
                    Validators.minLength(msisdnLength),
                    Validators.maxLength(msisdnLength),
                ]
            ),
            account: new FormControl('',
                [
                    Validators.minLength(1),
                ]),
            sum: new FormControl('',
                [
                    Validators.min(1),
                    Validators.max(1000000)
                ]),
        });
    }

    get msisdn() {
        return this.frmOperation.get('msisdn');
    }

    get account() {
        return this.frmOperation.get('account');
    }

    get sum() {
        return this.frmOperation.get('sum');
    }

    get details() {
        return this.paymentService.details;
    }

    get payment() {
        return this.paymentService.payment;
    }

    addDetail() {
        let detail = new PaymentDetail();
        detail.msisdn = this.msisdn.value;
        detail.account = this.account.value;
        detail.sum = Number(this.sum.value);
        detail.distrStrategy = this.paymentService.determineDistrStrategyByDetail(detail);
        detail.status = PaymentStatus.STATUS_NEW;
        this.paymentService.addNewDetail(detail);
        this.clearFields();
    }

    clearFields() {
        this.clearAccount();
        this.clearMsisdn();
        this.clearSum();
    }

    clearMsisdn() {
        this.msisdn.setValue('');
    }

    clearAccount() {
        this.account.setValue('');
    }

    clearSum() {
        this.sum.setValue('');
    }

    msisdnChanged() {
        this.clearAccount();
    }

    accountChanged() {
        this.clearMsisdn();
    }

    isValidAddBtn() : boolean {
        return ((this.msisdn.value != '' && this.msisdn != null) && (this.sum.value != '' && this.sum.value != null) ||
            (this.account.value != '' && this.account != null) && (this.sum.value != '' && this.sum.value != null));
    }

    isBlocked(): boolean {
        return this.paymentService.isBlocked();
    }

}
