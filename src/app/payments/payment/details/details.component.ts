import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {
    PaymentDetailDistrStrategy, PaymentDetailsTableColumns, PaymentDetailTableColumnsDisplay, PaymentStatus,
    TOOLTIPS
} from '../../../settings';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {PaymentDetail} from '../../model/payment-detail';
import {Subscription} from 'rxjs';
import {PaymentService} from '../payment.service';
import {PaymentStatusEnRu} from '../../../settings';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

    paymentStatuses = PaymentStatus;
    paymentStatusesEnRu = PaymentStatusEnRu;

    tooltips = TOOLTIPS;
    dataSource = new MatTableDataSource<PaymentDetail>();
    displayedColumns: string[] = PaymentDetailsTableColumns;
    detailTableColumnsDisplay = PaymentDetailTableColumnsDisplay;
    i: number = 0;
    paginatorResultsLength: number = 0;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    subscription: Subscription;
    paymentDistrStrategies = PaymentDetailDistrStrategy;
    @Input() status: boolean;

    constructor(private paymentService: PaymentService) {
    }

    get details() {
        return this.paymentService.details;
    }

    ngOnInit() {
        this.subscription = this.paymentService.detailsAnnounced$.subscribe(
            details => {
                this.dataSource.data = details;
            });
        this.paginatorResultsLength = this.details.length;
        this.dataSource.paginator = this.paginator;
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
