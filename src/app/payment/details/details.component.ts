import {Component, OnInit, ViewChild, OnDestroy, AfterViewInit} from '@angular/core';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {PaymentService} from '../payment.service';
import {MatSort} from '@angular/material/sort';
import {Detail} from '../model/detail';
import {PaymentStatus, TOOLTIPS} from '../../settings';

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
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy, AfterViewInit {

    PaymentStatus = PaymentStatus;
    tooltips = TOOLTIPS;
    dataSource = new MatTableDataSource<Detail>();
    displayedColumns: string[] = PaymentDetailsTableColumns;
    detailTableColumnsDisplay = PaymentDetailTableColumnsDisplay;
    subscription: Subscription;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private payService: PaymentService) {
        this.subscription = this.payService.payAnnounced$.subscribe(
            payment => {
                this.dataSource.data = payment.details;
                this.setPaginator();
            });
    }

    ngOnInit(): void {
        //this.payService.announcePayment();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    get payment() {
        return this.payService.payment;
    }

    setPaginator() {
        this.dataSource.paginator = this.paginator;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    del(row) {
        this.payService.delDetail(row);
    }

    delAll() {
        this.payService.delAll();
    }

    sum() {
       return this.payService.detailsSum();
    }

    canDelSome() {
        return this.payService.canDelSome();
    }

    canDelDetail(detail) {
        return this.payService.canDelDetail(detail);
    }

    ngAfterViewInit(): void {
        this.payService.announcePayment();
    }

}
