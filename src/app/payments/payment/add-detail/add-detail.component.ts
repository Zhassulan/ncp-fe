import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {msisdnLength, PaymentStatus} from '../../../settings';
import {PaymentService} from '../payment.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Detail} from '../model/detail';

@Component({
    selector: 'app-add-detail',
    templateUrl: './add-detail.component.html',
    styleUrls: ['./add-detail.component.css']
})
export class AddDetailComponent implements OnInit {

    @Input() msisdns;
    @Input() accounts;
    msisdnFilteredOptions: Observable<string[]>;
    accountFilteredOptions: Observable<string[]>;
    frmDetail: FormGroup = new FormGroup(
        {
            msisdnControl: new FormControl('',
                [
                    Validators.minLength(msisdnLength),
                    Validators.maxLength(msisdnLength),
                ]),
            accountControl: new FormControl('',
                [
                    Validators.minLength(1),
                ]),
            sumControl: new FormControl('',
                [
                    Validators.min(1),
                    Validators.max(this.paymentSum())
                ])
        }
    );

    constructor(private payService: PaymentService) {
        this.msisdnFilteredOptions = this.msisdnControl.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this._filterMsisdn(state) : this.msisdns.slice())
            );
        this.accountFilteredOptions = this.accountControl.valueChanges
            .pipe(
                startWith(''),
                map(state => state ? this._filterAccount(state) : this.accounts.slice())
            );
    }

    private _filterMsisdn(value: string): String [] {
        return this.msisdns.filter(item => item.indexOf(value) === 0);
    }

    private _filterAccount(value: string): String [] {
        return this.accounts.filter(item => item.indexOf(value) === 0);
    }

    get msisdnControl() {
        return this.frmDetail.get('msisdnControl');
    }

    get accountControl() {
        return this.frmDetail.get('accountControl');
    }

    get sumControl() {
        return this.frmDetail.get('sumControl');
    }

    addDetail() {
        let detail = new Detail();
        detail.paymentId = this.payService.payment.id;
        this.msisdnControl.value == "" || this.msisdnControl.value == null ? detail.msisdn = null : detail.msisdn = this.msisdnControl.value;
        this.accountControl.value == "" || this.accountControl.value == null ? detail.account = null : detail.account = this.accountControl.value;
        let sum = this.sumControl.value;
        sum = sum.replace(',', '.');
        console.log(sum);
        detail.sum = Number(sum);
        detail.status = PaymentStatus.NEW;
        this.payService.addDetail(detail);
        this.clearFields();
    }
    
    canAddDetail() {
        return this.payService.canAddDetail();
    }

    clearFields() {
        this.clearAccount();
        this.clearMsisdn();
        this.clearSum();
    }

    clearMsisdn() {
        this.msisdnControl.setValue('');
    }

    clearAccount() {
        this.accountControl.setValue('');
    }

    clearSum() {
        this.sumControl.setValue('');
    }

    msisdnChanged() {
        this.clearAccount();
    }

    accountChanged() {
        this.clearMsisdn();
    }

    isBlocked(): boolean {
        return this.payService.isBlocked();
    }

    ngOnInit(): void {
    }

    detailsTotal() {
        return this.payService.detailsSum();
    }

    paymentSum() {
        return this.payService.payment.sum;
    }

}
