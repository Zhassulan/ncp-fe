import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {NcpPayment} from '../../../model/ncp-payment';
import {PaymentsService} from '../../payments.service';
import {Router} from '@angular/router';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {FilePaymentItem} from '../../../equipment/model/file-payment-item';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Operation} from './model/operation';
import {msisdnLength} from '../../../settings';

@Component({
    selector: 'app-view-payment',
    templateUrl: './view-payment.component.html',
    styleUrls: ['./view-payment.component.css']
})
export class ViewPaymentComponent implements OnInit, AfterViewInit {

    payment: NcpPayment;
    operationForm: FormGroup;
    dataSource = new MatTableDataSource<Operation>();
    operations = [];
    isWait: boolean = true;
    displayedColumns: string[] = ['num', 'phone', 'account', 'sum', 'del'];
    i: number = 0;
    paginatorResultsLength: number = 0;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    total: number = 0;
    accountValue;
    phoneValue;
    sumValue;

    constructor(private paymentsService: PaymentsService,
                private router: Router) {
        //this.payment = this.paymentsService.payments.find(x => x.id == this.paymentsService.paymentId);
        this.dataSource = new MatTableDataSource(this.operations);
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
        this.isWait = false;
        /*
        if (!this.payment)   {
            this.router.navigate(['payments'])
        }
        */
        //this.addOperation();
        //this.addOperation();

    }

    ngAfterViewInit(): void {
        this.paginatorResultsLength = this.operations.length;
        this.dataSource.paginator = this.paginator;
    }

    addOperation() {
        this.operations.push({
            phone: '7072110987',
            account: '12345678',
            sum: 10000,
        });
        this.dataSource = new MatTableDataSource(this.operations);
        this.paginatorResultsLength += 1;
        this.refreshTotal();
    }

    delOperation(row) {
        this.operations.splice(this.operations.indexOf(row), 1);
        this.dataSource = new MatTableDataSource(this.operations);
        this.paginatorResultsLength -= 1;
        this.refreshTotal();
    }

    refreshTotal() {
        this.total = 0;
        this.operations.forEach(operation => {
            this.total += operation.sum;
        });
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

    get phone() { return this.operationForm.get('phone'); }
    get account() { return this.operationForm.get('account'); }

}
