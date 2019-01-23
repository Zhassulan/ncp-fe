import {Component, Input, OnInit} from '@angular/core';
import {NcpPayment} from '../../../model/ncp-payment';
import {PaymentsService} from '../../payments.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FilePaymentItem} from '../../../equipment/model/file-payment-item';
import {MatTableDataSource} from '@angular/material';
import {Operation} from './model/operation';

@Component({
    selector: 'app-view-payment',
    templateUrl: './view-payment.component.html',
    styleUrls: ['./view-payment.component.css']
})
export class ViewPaymentComponent implements OnInit {

    payment: NcpPayment;
    operationForm: FormGroup = new FormGroup({
        phoneNumber: new FormControl(
            '',
            [
                Validators.min(10),
                Validators.max(10)
            ]
        ),
        account: new FormControl('',
            [
                Validators.min(10),
                Validators.max(10)
            ]),
        sum: new FormControl('',
            [
                Validators.min(10),
                Validators.max(10)
            ]),
    });
    dataSource = new MatTableDataSource<Operation>();
    operations = [];
    isWait: boolean = true;
    displayedColumns: string[] = ['num', 'phone', 'account', 'sum', 'del'];
    i: number = 0;

    constructor(private paymentsService: PaymentsService,
                private router: Router) {
        //this.payment = this.paymentsService.payments.find(x => x.id == this.paymentsService.paymentId);
        this.dataSource = new MatTableDataSource(this.operations);
    }

    ngOnInit() {
        this.isWait = false;
        /*
        if (!this.payment)   {
            this.router.navigate(['payments'])
        }
        */
        this.addOperation();
        this.addOperation();
    }

    addOperation() {
        this.operations.push({
            phone: '7072110987',
            account: '12345678',
            sum: 10000,
        });
        this.dataSource = new MatTableDataSource(this.operations);
    }

    delOperation(row)  {
        const index: number = this.operations.indexOf(row);
        if (index !== -1) {
            this.operations.splice(index, 1);
            this.dataSource = new MatTableDataSource(this.operations);
        }
    }

}
