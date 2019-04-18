import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UploadFilePaymentService} from '../upload-file-payment.service';
import {MatTableDataSource} from '@angular/material';
import {FilePaymentItem} from '../model/file-payment-item';
import {Router} from '@angular/router';

@Component({
    selector: 'app-file-payment-view',
    templateUrl: './file-payment-view.component.html',
    styleUrls: ['./file-payment-view.component.css']
})
export class FilePaymentViewComponent implements OnInit {

    filePayment;
    dataSource = new MatTableDataSource<FilePaymentItem>();
    displayedColumns: string[] = ['num', 'nomenclature', 'msisdn', 'icc', 'account', 'sum'];

    constructor(private uploadService: UploadFilePaymentService,
                private router: Router,
                ) {
    }

    ngOnInit() {
        if (this.uploadService.filePayment) {
            this.filePayment = this.uploadService.filePayment;
            this.dataSource = new MatTableDataSource(this.filePayment.filePaymentItems);
        } else
            this.router.navigate(['equipment']);
    }

    goBack() {
        this.router.navigate(['equipment']);
    }

}
