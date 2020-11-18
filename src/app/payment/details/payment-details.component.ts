import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {PaymentService} from '../payment.service';
import {MatSort} from '@angular/material/sort';
import {Detail} from '../model/detail';
import {PaymentStatus} from '../../settings';
import {Subscription} from 'rxjs';

const PaymentDetailsTableColumns = [
    'num',
    'nomenclature',
    'msisdn',
    'icc',
    'account',
    'sum',
    'status',
    'del'
];

enum PaymentDetailTableColumnsDisplay {
    num = '#',
    nomenclature = 'Номенклатура',
    msisdn = 'Номер',
    icc = 'ICC',
    account = 'Лицевой счёт',
    sum = 'Сумма',
    status = 'Статус',
    del = 'Удалить'
};

@Component({
    selector: 'app-details',
    templateUrl: './payment-details.component.html',
    styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

    paymentStatus = PaymentStatus;
    detailsDS = new MatTableDataSource<Detail>();
    displayedColumns: string[] = PaymentDetailsTableColumns;
    detailTableColumnsDisplay = PaymentDetailTableColumnsDisplay;
    @ViewChild(MatPaginator, {static: true}) public paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) public sort: MatSort;
    subPayment: Subscription;

    constructor(private payService: PaymentService) {    }

    ngOnInit(): void {
        this.subPayment = this.payService.payAnnounced$.subscribe(
            payment => {
                this.detailsDS.sort = this.sort;
                this.detailsDS.paginator = this.paginator;
                this.detailsDS.data = payment.details;
            });
    }

    del(row) {
        this.payService.delDetail(row);
    }

    delAll() {
        this.payService.delAll();
    }

    canDelDetail(detail) {
        return this.payService.canDelDetail(detail);
    }

    canDelSome() {
        return this.payService.canDelSome();
    }

    sum() {
        return this.payService.payment.details.length > 0 ? this.payService.detailsSum() : 0;
    }

    ngOnDestroy(): void {
        if (this.subPayment) this.subPayment.unsubscribe();
    }

    ngAfterViewInit(): void {
        this.payService.announcePayment();
    }

}
