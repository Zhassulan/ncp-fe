import {AfterViewInit, Component, OnInit, ViewChild, isDevMode} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DialogService} from '../dialog/dialog.service';
import {PaymentService} from '../payment/payment.service';
import {UserService} from '../user/user.service';
import {Router} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {PaymentStatus, PaymentStatusRu} from '../settings';
import {AppService} from '../app.service';
import {ExcelService} from '../excel/excel.service';
import {DateRangeComponent} from '../date-range/date-range.component';
import {NotificationsService} from 'angular2-notifications';
import {Payment} from '../payment/model/payment';
import {PayDataService} from '../data/pay-data-service';
import {PaymentsTableComponent} from './payments-table/payments-table.component';

@Component({
    selector: 'app-payments',
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

    @ViewChild(DateRangeComponent, {static: true})
    dateRangeComponent: DateRangeComponent;
    @ViewChild(PaymentsTableComponent)
    private paymentsTableComponent: PaymentsTableComponent;
    selection = new SelectionModel<Payment>(true, []);

    constructor() {
    }

    get dataSource() {
        return this.paymentsTableComponent.dataSource;
    }

    ngOnInit() {    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage();
    }

    export() {
        this.paymentsTableComponent.export();
    }

    transitSelected() {
        this.paymentsTableComponent.transitSelected();
    }

    loadData() {
        this.paymentsTableComponent.loadData();
    }

}
