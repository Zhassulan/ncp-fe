import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {msisdnLength} from '../../../settings';
import {PaymentService} from '../payment.service';

@Component({
    selector: 'app-payment-add-operation',
    templateUrl: './add-operation.component.html',
    styleUrls: ['./add-operation.component.css']
})
export class AddOperationComponent implements OnInit {

    operationForm: FormGroup;

    constructor(private paymentService: PaymentService) {
    }

    ngOnInit() {
        this.operationForm = new FormGroup({
            phone: new FormControl(
                '',
                [
                    Validators.minLength(msisdnLength),
                    Validators.maxLength(msisdnLength),
                    //this.excludeValidator('phone')
                ]
            ),
            account: new FormControl('',
                [
                    Validators.min(1),
                    //this.excludeValidator('account')
                ]),
            sum: new FormControl('',
                [
                    Validators.min(1),
                    Validators.max(1000000)
                ]),
        });
        this.onChangesPhone();
        this.onChangesAccount();
    }

    get phone() {
        return this.operationForm.get('phone');
    }

    get account() {
        return this.operationForm.get('account');
    }

    get sum()   {
        return this.operationForm.get('sum');
    }

    addOperation() {
        this.paymentService.addOperation(this.phone.value, this.account.value, this.sum.value);
        this.clearFields();
    }

    clearFields()   {
        this.clearAccount();
        this.clearPhone();
        this.clearSum();
    }

    clearPhone() {
        this.phone.setValue('');
    }

    clearAccount() {
        this.account.setValue('');
    }

    clearSum() {
        this.sum.setValue('');
    }

    onChangesAccount() {
        this.account.valueChanges.subscribe(val => {
            this.clearPhone();
        });
    }

    onChangesPhone() {
        this.phone.valueChanges.subscribe(val => {
            this.clearAccount();
        });
    }

}
