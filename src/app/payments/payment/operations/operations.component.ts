import {
    Component, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import {Operation} from './model/operation';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {PaymentService} from '../payment.service';
import {Subscription} from 'rxjs';
import {PaymentDistrStrategy} from '../../../settings';

@Component({
    selector: 'app-payment-operations',
    templateUrl: './operations.component.html',
    styleUrls: ['./operations.component.css'],
})
export class OperationsComponent implements OnInit, OnDestroy {

    dataSource = new MatTableDataSource<Operation>();
    displayedColumns: string[] = ['num', 'msisdn', 'account', 'sum', 'del'];
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
        console.log('init');
        this.subscription = this.paymentService.operationsAnnounced$.subscribe(
            operations => {
                console.log('subscribe');
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
