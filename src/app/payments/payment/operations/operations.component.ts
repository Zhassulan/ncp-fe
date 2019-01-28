import {
    Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
    ViewChild
} from '@angular/core';
import {Operation} from './model/operation';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {PaymentService} from '../payment.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-payment-operations',
    templateUrl: './operations.component.html',
    styleUrls: ['./operations.component.css'],
})
export class OperationsComponent implements OnInit, OnDestroy {

    dataSource = new MatTableDataSource<Operation>();
    displayedColumns: string[] = ['num', 'phone', 'account', 'sum', 'del'];
    i: number = 0;
    paginatorResultsLength: number = 0;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    subscription: Subscription;

    constructor(private paymentService: PaymentService) {
        this.subscription = paymentService.operationsAnnounced$.subscribe(
            operations => {
                this.dataSource.data = operations;
            });
    }

    get operations()  {
        return this.paymentService.operations;
    }

    ngOnInit() {
        this.paginatorResultsLength = this.operations.length;
        this.dataSource.paginator = this.paginator;
    }

    delOperation(row) {
        this.paymentService.delOperation(row);
        this.dataSource.data = this.operations;
        this.paginatorResultsLength -= 1;
    }

    refreshOperations() {
        this.dataSource.data = this.operations;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getTotal(): number  {
        let total: number = 0;
        this.operations.forEach(operation => {
            total += Number(operation.sum);
        });
        return total;
    }

}
