import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UploadFilePaymentService} from '../upload-file-payment.service';
import {MatTableDataSource} from '@angular/material';
import {FilePaymentItem} from '../model/file-payment-item';
import {Router} from '@angular/router';
import {PaymentsService} from '../../payments/payments.service';
import {UserService} from '../../user/user.service';
import {NGXLogger} from 'ngx-logger';
import {RawPayment} from '../../payments/payment/model/raw-payment';
import {mergeMap, tap} from 'rxjs/operators';
import {retryBackoff} from 'backoff-rxjs';


@Component({
    selector: 'app-file-payment-view',
    templateUrl: './file-payment-view.component.html',
    styleUrls: ['./file-payment-view.component.css']
})
export class FilePaymentViewComponent implements OnInit, AfterViewInit {

    filePayment;
    dataSource = new MatTableDataSource<FilePaymentItem>();
    displayedColumns: string[] = ['num', 'nomenclature', 'msisdn', 'icc', 'account', 'sum'];
    rawPayment;
    ncpPayment;
    isWait: boolean = true;

    constructor(private uploadService: UploadFilePaymentService,
                private router: Router,
                private paymentsService: PaymentsService,
                private userService: UserService,
                private logger: NGXLogger) {
    }

    ngOnInit() {
        this.isWait = false;
        if (this.uploadService.filePayment) {
            this.filePayment = this.uploadService.filePayment;
            this.dataSource = new MatTableDataSource(this.filePayment.filePaymentItems);
        } else
            this.router.navigate(['equipment']);
    }

    ngAfterViewInit(): void {
        if (this.filePayment) {
            this.getPayments();
        }
    }

    goBack() {
        this.router.navigate(['equipment']);
    }

    getPayments() {
        this.isWait = true;
        let stubRawPayment: RawPayment = new RawPayment();
        let dt = new Date(this.filePayment.filePaymentHeader.payment_date);
        stubRawPayment.creationDate = dt.getTime().toString();
        stubRawPayment.sum = this.filePayment.filePaymentItems[this.filePayment.filePaymentItems.length - 1].sum;
        stubRawPayment.nameSender = this.filePayment.filePaymentHeader.name_sender;
        stubRawPayment.rnnSender = this.filePayment.filePaymentHeader.iin_bin_sender;
        stubRawPayment.paymentDocNum = this.filePayment.filePaymentHeader.payment_docnum;
        stubRawPayment.paymentId = 0;
        const obsNcpPayment = this.paymentsService.createRawPayment(stubRawPayment).pipe(
            mergeMap(rawPayment => this.paymentsService.getNcpPaymentByRawId().pipe(
                retryBackoff({
                    initialInterval: 3000,
                    maxInterval: 5000,
                    shouldRetry: (error) => {return true;}
                })
            ))
        );
        obsNcpPayment.subscribe(
            () => {
            },
            () => {
            },
            () => {
                this.isWait = false;
            }
        );
    }

}
