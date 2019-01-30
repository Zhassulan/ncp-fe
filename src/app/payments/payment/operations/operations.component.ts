import {
    Component, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import {Operation} from './model/operation';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {PaymentService} from '../payment.service';
import {Subscription} from 'rxjs';
import {PaymentDistrStrategy} from '../../../settings';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {PaymentsService} from '../../payments.service';

@Component({
    selector: 'app-payment-operations',
    templateUrl: './operations.component.html',
    styleUrls: ['./operations.component.css'],
})
export class OperationsComponent implements OnInit, OnDestroy {

    dataSource = new MatTableDataSource<Operation>();
    displayedColumns: string[] = ['num', 'nomenclature', 'msisdn', 'icc', 'account', 'sum', 'del'];
    i: number = 0;
    paginatorResultsLength: number = 0;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    subscription: Subscription;
    paymentDistrStrategies = PaymentDistrStrategy;

    constructor(private paymentService: PaymentService) {
    }

    get operations() {
        return this.paymentService.operations;
    }

    ngOnInit() {
        this.subscription = this.paymentService.operationsAnnounced$.subscribe(
            operations => {
                this.dataSource.data = operations;
            });
        this.paginatorResultsLength = this.operations.length;
        this.dataSource.paginator = this.paginator;
    }

    delOperation(row) {
        this.paymentService.delOperation(row);
        this.dataSource.data = this.operations;
        this.paginatorResultsLength -= 1;
    }

    ngOnDestroy(): void {
        if (this.subscription)
            this.subscription.unsubscribe();
    }

    getTotal(): number {
        let total: number = 0;
        this.operations.forEach(operation => {
            total += Number(operation.sum);
        });
        return total;
    }

}
