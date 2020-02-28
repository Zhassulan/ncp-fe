import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {msisdnLength, PaymentStatus} from '../../../settings';
import {PaymentDetail} from '../../model/payment-detail';
import {PaymentService} from '../payment.service';

@Component({
    selector: 'app-add-detail',
    templateUrl: './add-detail.component.html',
    styleUrls: ['./add-detail.component.css']
})
export class AddDetailComponent implements OnInit {

    frmDetail: FormGroup;

    constructor(private paymentService: PaymentService) {
    }

    get msisdn() {
        return this.frmDetail.get('msisdn');
    }

    get account() {
        return this.frmDetail.get('account');
    }

    get sum() {
        return this.frmDetail.get('sum');
    }

    get details() {
        return this.paymentService.payment.details;
    }

    get payment() {
        return this.paymentService.payment;
    }

    ngOnInit() {
        this.frmDetail = new FormGroup({
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
                    //Validators.max(1000000)
                ]),
        });
    }

    addDetail() {
        let detail = new PaymentDetail();
        detail.msisdn = this.msisdn.value;
        detail.account = this.account.value;
        detail.sum = Number(this.sum.value);
        detail.distrStrategy = this.paymentService.determineDistrStrategyByDetail(detail);
        detail.status = PaymentStatus.STATUS_NEW;
        this.paymentService.addDetail(detail);
        this.paymentService.announcePayment();
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

    isValidAddBtn(): boolean {
        return ((this.msisdn.value != '' && this.msisdn != null) && (this.sum.value != '' && this.sum.value != null) ||
            (this.account.value != '' && this.account != null) && (this.sum.value != '' && this.sum.value != null));
    }

    isBlocked(): boolean {
        return this.paymentService.isBlocked();
    }

}
