import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PaymentDetailsTableColumns, PaymentDetailTableColumnsDisplay, PaymentStatus, TOOLTIPS} from '../../../settings';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {PaymentService} from '../payment.service';
import {MatSort} from '@angular/material/sort';
import {Detail} from '../model/detail';

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

    constructor(private paymentService: PaymentService) { }

    get details() {
        return this.payment.details;
    }

    get payment() {
        return this.paymentService.payment;
    }

    ngOnInit() {
        this.subscription = this.paymentService.paymentAnnounced$.subscribe(
            payment => {
                this.dataSource.data = payment.details;
                this.setPaginator();
            });
    }

    ngAfterViewInit() {
        this.paymentService.announcePayment();
    }

    setPaginator() {
        this.paginatorResultsLength = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    delDetail(row) {
        this.paymentService.delDetail(row);
        this.paginatorResultsLength -= 1;
    }

    delAll() {
        this.paymentService.delAll();
        this.paginatorResultsLength = this.paymentService.payment.details.length;
    }

    getTotal(): number {
        let total: number = 0;
        this.paymentService.payment.details.forEach(detail => {
            total += Number(detail.sum);
        });
        return total;
    }

}
