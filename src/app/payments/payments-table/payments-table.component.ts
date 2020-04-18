import {Component, Input, isDevMode, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Payment} from '../payment/model/payment';
import {SelectionModel} from '@angular/cdk/collections';
import {PaymentStatus, PaymentStatusRu} from '../../settings';
import {PayDataService} from '../../data/pay-data-service';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {DialogService} from '../../dialog/dialog.service';
import {ExcelService} from '../../excel/excel.service';

@Component({
    selector: 'app-payments-table',
    templateUrl: './payments-table.component.html',
    styleUrls: ['./payments-table.component.css']
})
export class PaymentsTableComponent implements OnInit {

    displayedColumns = [
        'ID',
        'creationDate',
        'nameSender',
        'sum',
        'rnnSender',
        'paymentDetails',
        'statusRu',
        'managedBy',
        'accountSender',
        'accountRecipient',
        'knp',
        'select',
        'rowMenu'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    dataSource = new MatTableDataSource<Payment>();
    paginatorResultsLength = 0;
    pageSize = 30;
    pageSizeOptions: number[] = [50, 100, 150, 250, 300];
    PaymentStatus = PaymentStatus;
    @Input() dateRangeComponent;
    @Input() selection;

    constructor(private payDataService: PayDataService,
                private appService: AppService,
                private notif: NotificationsService,
                private router: Router,
                private dialogService: DialogService,
                private excelService: ExcelService,) {
        this.dataSource = new MatTableDataSource<Payment>();
        this.paginatorResultsLength = 0;
    }

    ngOnInit(): void {
        this.setPaginator();
        this.loadData();
    }

    setPaginator() {
        this.paginatorResultsLength = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    initStatusRu(payments) {
        payments.forEach(payment => this.setStatusRu(payment));
    }

    setStatusRu(payment) {
        payment.statusRu = PaymentStatusRu[payment.status];
    }

    loadData() {
        if (isDevMode())
            this.dateRangeComponent.setCalendarToDate('2019-12-31T00:00:00.000', '2019-12-31T23:59:59.999');
        this.dateRangeComponent.setTimeBoundariesForDatePickers();
        this.appService.setProgress(true);
        this.payDataService.all(this.dateRangeComponent.pickerStartDate.value.getTime(), this.dateRangeComponent.pickerEndDate.value.getTime()).subscribe(
            data => {
                this.initStatusRu(data);
                this.dataSource.data = data;
            },
            error => {
                this.appService.setProgress(false);
                if (error.status) {
                    if (error.status == 503)
                        this.notif.error(`Сервис не доступен`);
                } else this.notif.error(error);
            },
            () => this.appService.setProgress(false));
    }

    loadFileData() {
        this.appService.setProgress(true);
        this.dataSource.data = [];
        this.payDataService.json().subscribe(data => {
                this.dataSource.data = data;
            }, error => {
                this.notif.error(error.error.errm);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ? this.selection.clear() :
            this.selection.selected.length > 0 ? this.selection.clear() : this.dataSource.filteredData.forEach(row => this.selection.select(row));
    }

    menuOnRowOpenPayment(paymentRow) {
        this.router.navigate(['payments/' + paymentRow.id]);
    }

    menuOnRowDeleteTransit(payment) {
        this.dialogService.clear();
        this.dialogService.title = 'Удаление с тразитного счёта';
        this.dialogService.openDialog();
        this.transitDel(payment.id);
    }

    menuOnRowToTransit(payment) {
        this.dialogService.clear();
        this.dialogService.title = 'Перевод на транзитный счёт';
        this.dialogService.openDialog();
        this.transit(payment.id);
    }

    transit(id) {
        this.appService.setProgress(true);
        this.payDataService.transit(id).subscribe(
            data => {
                let payment = this.dataSource.data.find(x => x.id == id);
                payment.status = data.status;
                payment.statusRu = PaymentStatusRu[payment.status];
                this.dialogService.addItem(`ID ${id} OK - TRANSIT_PDOC_ID ${data.transitPdocNumId}`);
            },
            error => {
                this.dialogService.addItem(`ID ${id} Ошибка - ${error.error.errm}`);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    transitDel(id) {
        this.appService.setProgress(true);
        this.payDataService.transitDel(id).subscribe(
            data => {
                let payment = this.dataSource.data.find(x => x.id == id);
                payment.status = data.status;
                payment.statusRu = PaymentStatusRu[payment.status];
                this.dialogService.addItem(`ID ${id} OK - TRANSIT_PDOC_ID ${data.transitPdocNumId}`);
            },
            error => {
                this.dialogService.addItem(`ID ${id} Ошибка - ${error.error.errm}`);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    onRowClicked(paymentRow) {
        //нельзя использовать, т.к. не работает меню строки!
        //this.menuOnRowOpenPayment(paymentRow);
    }

    export() {
        this.selection.selected.length > 0 ? this.excelService.save(this.selection.selected) : this.excelService.save(this.dataSource.data);
    }

    transitSelected() {
        if (this.selection.selected.length > 0) {
            this.dialogService.clear();
            this.dialogService.title = 'Перевод на транзитный счёт';
            this.dialogService.openDialog();
            this.selection.selected.forEach(payment => this.transit(payment.id));
        }
    }

}
