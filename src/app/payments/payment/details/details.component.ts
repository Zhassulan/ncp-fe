import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PaymentStatus, TOOLTIPS} from '../../../settings';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {PaymentService} from '../payment.service';
import {MatSort} from '@angular/material/sort';
import {Detail} from '../model/detail';

 const PaymentDetailsTableColumns = [
    'num',
    'nomenclature',
    'msisdn',
    'icc',
    'account',
    'sum',
    'del'
];

enum PaymentDetailTableColumnsDisplay {
    num = '#',
    nomenclature = 'Номенклатура',
    msisdn = 'Номер',
    icc = 'ICC',
    account = 'Лицевой счёт',
    sum = 'Сумма',
    del = 'Удалить'
};

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

    paymentStatuses = PaymentStatus;
    tooltips = TOOLTIPS;
    dataSource = new MatTableDataSource<Detail>();
    displayedColumns: string[] = PaymentDetailsTableColumns;
    detailTableColumnsDisplay = PaymentDetailTableColumnsDisplay;
    i: number = 0;
    paginatorResultsLength: number = 0;
    subscription: Subscription;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private payService: PaymentService) { }

    ngOnInit() {
        this.subscription = this.payService.payAnnounced$.subscribe(
            payment => {
                this.dataSource.data = payment.details;
                this.setPaginator();
            });
    }

    get payment() {
        return this.payService.payment;
    }

    setPaginator() {
        this.paginatorResultsLength = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    delDetail(row) {
        this.payService.delDetail(row);
        this.paginatorResultsLength -= 1;
    }

    delAll() {
        this.payService.delAll();
        this.paginatorResultsLength = this.payService.payment.details.length;
    }

    detailsSum() {
        return this.payService.detailsSum();
    }

}
