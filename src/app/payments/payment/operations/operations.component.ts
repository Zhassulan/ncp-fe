import {
    Component, Input, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import {Operation} from './model/operation';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {PaymentService} from '../payment.service';
import {Subscription} from 'rxjs';
import {PaymentDetailsTableColumns, PaymentDetailDistrStrategy, PaymentDetailTableColumnsDisplay} from '../../../settings';
import {PaymentDetail} from '../../model/payment-detail';
import {TOOLTIPS} from '../../../settings';
import {PaymentStatus} from '../../../settings';

@Component({
    selector: 'app-payment-operations',
    templateUrl: './operations.component.html',
    styleUrls: ['./operations.component.css'],
})

export class OperationsComponent implements OnInit, OnDestroy {

    paymentStatus = PaymentStatus;
    tooltips = TOOLTIPS;
    dataSource = new MatTableDataSource<PaymentDetail>();
    displayedColumns: string[] = PaymentDetailsTableColumns;
    detailTableColumnsDisplay = PaymentDetailTableColumnsDisplay;
    i: number = 0;
    paginatorResultsLength: number = 0;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    subscription: Subscription;
    paymentDistrStrategies = PaymentDetailDistrStrategy;
    @Input() status: boolean;

    constructor(private paymentService: PaymentService) {
    }

    get operations() {
        return this.paymentService.operations;
    }

    get details() {
        //return this.paymentService.operations;
        return this.paymentService.details;
    }

    ngOnInit() {
        /*
        this.subscription = this.paymentService.operationsAnnounced$.subscribe(
            operations => {
                console.log('subscribe');
                this.dataSource.data = operations;
            }); */
        this.subscription = this.paymentService.detailsAnnounced$.subscribe(
            details => {
                this.dataSource.data = details;
            });
        this.paginatorResultsLength = this.details.length;
        this.dataSource.paginator = this.paginator;
    }

    delOperation_(row) {
        //this.paymentService.delOperation(row);
        //this.dataSource.data = this.operations;
        //this.paginatorResultsLength -= 1;
    }

    delDetail(row) {
        this.paymentService.delDetail(row);
        this.dataSource.data = this.details;
        this.paginatorResultsLength -= 1;
    }

    delAll() {
        this.paymentService.delAll();
        this.dataSource.data = this.details;
        this.paginatorResultsLength = this.details.length;
    }

    ngOnDestroy(): void {
        if (this.subscription)
            this.subscription.unsubscribe();
    }

    getTotal(): number {
        let total: number = 0;
        this.details.forEach(detail => {
            total += Number(detail.sum);
        });
        return total;
    }

}
