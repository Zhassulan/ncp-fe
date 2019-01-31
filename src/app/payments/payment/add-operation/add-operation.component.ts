import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {msisdnLength} from '../../../settings';
import {PaymentService} from '../payment.service';

@Component({
    selector: 'app-payment-add-operation',
    templateUrl: './add-operation.component.html',
    styleUrls: ['./add-operation.component.css']
})
export class AddOperationComponent implements OnInit {

    frmOperation: FormGroup;

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
        }, { validator: this.isAddValidator});
    }

    get msisdn() {
        return this.frmOperation.get('msisdn');
    }

    get account() {
        return this.frmOperation.get('account');
    }

    get sum()   {
        return this.frmOperation.get('sum');
    }

    addOperation() {
        this.paymentService.addOperation(null, this.msisdn.value, null, this.account.value, this.sum.value, null);
        this.clearFields();
    }

    clearFields()   {
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

    accountChanged()    {
        this.clearMsisdn();
    }

    isAddValidator: ValidatorFn = () =>    {
        return ((this.msisdn.value != '' ||  this.msisdn != null) && (this.sum.value != '' || this.sum.value != null) ||
            (this.account.value != '' ||  this.account != null) && (this.sum.value != '' || this.sum.value != null));
    }

}
