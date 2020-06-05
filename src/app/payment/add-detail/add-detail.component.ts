import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {PaymentService} from '../payment.service';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Detail} from '../model/detail';
import {MSG, msisdnLength, PaymentStatus} from '../../settings';
import {NotificationsService} from 'angular2-notifications';
import {ClientDataService} from '../../data/client-data-service';

@Component({
    selector: 'app-add-detail',
    templateUrl: './add-detail.component.html',
    styleUrls: ['./add-detail.component.scss']
})
export class AddDetailComponent implements OnInit, OnDestroy {

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
    @Input() payment;
    isPropsLoaded$: Subscription;

    constructor(private payService: PaymentService,
                private notifSerice: NotificationsService,
                private clntDataService: ClientDataService) {
        this.isPropsLoaded$ = this.payService.propsAnnounced$.subscribe(props => {
            // if props loaded, fill once accounts and phones for the first time
            if (props.count > 0) {
                this.clntDataService.accounts(this.payment.rnnSender, null, 10).subscribe(
                    data => this.accounts = data,
                    error => this.notifSerice.warn('Ошибка поиска счетов'));
                this.clntDataService.phones(this.payment.rnnSender, null, 10).subscribe(
                    data => this.phones = data,
                    error => this.notifSerice.warn('Ошибка поиска номеров'));
            }
        });
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
        this.payService.addDetail(this.phoneControl.value, this.accountControl.value, this.sumControl.value);
        this.clearFields();
    }

    canAddDetail() {
        return (((this.phoneControl.value != '' && this.phoneControl.value != null) ||
            (this.accountControl.value != '' && this.accountControl.value != null)) &&
            this.payService.canAddDetail() && Number(this.sumControl.value) > 0);
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
        if (!this.payService.canLoadPhones(this.payment) || this.phoneControl.value.trim().length == 0) return;
        this.clearAccount();
        this.clntDataService.phones(this.payment.rnnSender, this.phoneControl.value, 10).subscribe(
            data => {
                this.phones = data;
                this.filteredPhones = this.phoneControl.valueChanges
                    .pipe(startWith(''),
                        map(state => state ? this._filterPhone(state) : this.phones.slice()));

            });
    }

    accountChanged() {
        if (!this.payService.canLoadPhones(this.payment) || this.accountControl.value.trim().length == 0) return;
        this.clearPhone();
        this.clntDataService.accounts(this.payment.rnnSender, this.accountControl.value, 10).subscribe(
            data => {
                this.accounts = data;
                this.filteredAccounts = this.accountControl.valueChanges
                    .pipe(startWith(''),
                        map(state => state ? this._filterAccount(state) : this.accounts.slice()));
            });
    }

    isBlocked(): boolean {
        return this.payService.isBlocked();
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
        this.isPropsLoaded$.unsubscribe();
    }

    private _filterPhone(value: string): string [] {
        return this.phones.filter(item => item.indexOf(value) === 0);
    }

    private _filterAccount(value: string): string [] {
        return this.accounts.filter(item => item.indexOf(value) === 0);
    }

}
