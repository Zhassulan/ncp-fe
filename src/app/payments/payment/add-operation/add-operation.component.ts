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
                    Validators.max(7)
                ]),
        });
        this.onChangesPhone();
        this.onChangesAccount();
    }

    addOperation() {
        this.paymentService.addOperation('7072110987', '111111111', 500000);
        //this.childOperationsComponent.refreshOperations();
    }

    clearPhone() {
        if (this.operationForm.get('phone').value)
            this.operationForm.get('phone').setValue('');
    }

    clearAccount() {
        if (this.operationForm.get('account').value)
            this.operationForm.get('account').setValue('');
    }

    clearSum() {
        this.operationForm.get('sum').setValue('');
    }

    onChangesAccount() {
        this.operationForm.get('account').valueChanges.subscribe(val => {
            this.clearPhone();
        });
    }

    onChangesPhone() {
        this.operationForm.get('phone').valueChanges.subscribe(val => {
            this.clearAccount();
        });
    }

    get phone() {
        return this.operationForm.get('phone');
    }

    get account() {
        return this.operationForm.get('account');
    }

}
