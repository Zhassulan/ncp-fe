import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PaymentService} from '../payment.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Detail} from '../model/detail';
import {MSG, msisdnLength, PaymentStatus} from '../../settings';
import {NotificationsService} from 'angular2-notifications';
import {ClientDataService} from '../../data/client-data-service';

@Component({
    selector: 'app-add-detail',
    templateUrl: './add-detail.component.html',
    styleUrls: ['./add-detail.component.css']
})
export class AddDetailComponent implements OnInit {

    phones: string[] = [];
    accounts: string[] = [];
    filteredPhones: Observable<string[]>;
    filteredAccounts: Observable<string[]>;
    frmDetail: FormGroup = new FormGroup(
        {
            phoneControl: new FormControl('',
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
                    Validators.min(1)
                ])
        }
    );

    constructor(private payService: PaymentService,
                private notifSerice: NotificationsService,
                private clntDataService: ClientDataService) {
        this.filteredPhones = this.phoneControl.valueChanges
            .pipe(startWith(''),
                map(state => state ? this._filterPhone(state) : this.phones.slice()));
        this.filteredAccounts = this.accountControl.valueChanges
            .pipe(startWith(''),
                map(state => state ? this._filterAccount(state) : this.accounts.slice()));
    }

    get phoneControl() {
        return this.frmDetail.get('phoneControl');
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
        this.phoneControl.value == '' || this.phoneControl.value == null ? detail.msisdn = null : detail.msisdn = this.phoneControl.value;
        this.accountControl.value == '' || this.accountControl.value == null ? detail.account = null : detail.account = this.accountControl.value;
        let sum = this.sumControl.value;
        sum = sum.replace(',', '.');
        sum = sum.trim();
        sum = sum.replace(/[\r\n\t\f\v ]/, '');
        if (isNaN(Number(sum))) {
            this.notifSerice.warn(MSG.inputNumber);
            return;
        }
        detail.sum = Number(sum);
        detail.status = PaymentStatus.NEW;
        this.payService.addDetail(detail);
        this.clearFields();
    }

    canAddDetail() {
        return (((this.phoneControl.value != '' && this.phoneControl.value != null) ||
            (this.accountControl.value != '' && this.accountControl.value != null)) &&
            this.payService.canAddDetail());
    }

    clearFields() {
        this.clearAccount();
        this.clearPhone();
        this.clearSum();
    }

    clearPhone() {
        this.phoneControl.setValue('');
    }

    clearAccount() {
        this.accountControl.setValue('');
    }

    clearSum() {
        this.sumControl.setValue('');
    }

    phoneChanged() {
        if (!this.payService.canLoadPhones()) return;
        this.clearAccount();
        this.clntDataService.phones(this.phoneControl.value, 10).subscribe(
            data => this.phones = data,
            error => this.notifSerice.warn('Ошибка поиска номеров'));
    }

    accountChanged() {
        if (!this.payService.canLoadPhones()) return;
        this.clearPhone();
        this.clntDataService.accounts(this.accountControl.value, 10).subscribe(
            data => {
                this.accounts = [];
                this.accounts = data
            },
            error => this.notifSerice.warn('Ошибка поиска счетов'));
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

    private _filterPhone(value: string): string [] {
        return this.phones.filter(item => item.indexOf(value) === 0);
    }

    private _filterAccount(value: string): string [] {
        return this.accounts.filter(item => item.indexOf(value) === 0);
    }

}
