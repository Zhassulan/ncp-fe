import {Component, Input, isDevMode, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Payment} from '../../payment/model/payment';
import {MSG, PaymentStatus, PaymentStatusRu} from '../../settings';
import {PayDataService} from '../../data/pay-data-service';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {DlgService} from '../../dialog/dlg.service';
import {ExcelService} from '../../excel/excel.service';
import {Subscription} from 'rxjs';
import {PaymentService} from '../../payment/payment.service';
import {MobipayDataService} from '../../data/mobipay-data.service';

@Component({
    selector: 'app-payments-table',
    templateUrl: './payments-table.component.html',
    styleUrls: ['./payments-table.component.scss']
})
export class PaymentsTableComponent implements OnInit, OnDestroy {

    displayedColumns = [
        'ID',
        'nameSender',
        'sum',
        'rnnSender',
        'paymentDetails',
        'statusRu',
        'managedBy',
        'account',
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
    private subscription: Subscription;

    constructor(private payDataService: PayDataService,
                private appService: AppService,
                private notifService: NotificationsService,
                private router: Router,
                private dialogService: DlgService,
                private excelService: ExcelService,
                private payService: PaymentService,
                private mobipayDataService: MobipayDataService) {
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
        if (isDevMode()) {
            this.dateRangeComponent.start = '2019-12-31T00:00:00.000';
            this.dateRangeComponent.end = '2019-12-31T23:59:59.999';
        }
        this.appService.setProgress(true);
        this.subscription = this.payDataService.range(this.dateRangeComponent.start, this.dateRangeComponent.end).subscribe(
            data => {
                this.initStatusRu(data);
                this.dataSource.data = data;
            },
            error => {
                this.appService.setProgress(false);
                this.notifService.error(error.message);
            },
            () => this.appService.setProgress(false));
    }

    loadFileData() {
        this.appService.setProgress(true);
        this.dataSource.data = [];
        this.payDataService.json().subscribe(data => {
                this.dataSource.data = data;
            }, error => {
                this.notifService.error(error.message);
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

    menuOnRowMobipay(paymentRow) {
        this.appService.setProgress(true);
        this.mobipayDataService.change(paymentRow.id, true).subscribe(
            data => {
                this.notifService.info(MSG.mobipayChanged);
            },
            error => {
                this.notifService.error(error.message);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    menuOnRowDeleteTransit(payment) {
        this.dialogService.clear();
        this.dialogService.title = 'Удаление с тразитного счёта';
        this.dialogService.openDialog();
        this.transitDel(payment.id);
    }

    menuOnRowTransit(payment) {
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
                this.dialogService.addItem(`ID ${id} Ошибка - ${error.message}`);
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
                this.dialogService.addItem(`ID ${id} Ошибка - ${error}`);
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

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    canTransit(row) {
        this.payService.setPayment(row);
        return this.payService.canTransit();
    }

    canDelTransit(row) {
        this.payService.setPayment(row);
        return this.payService.canDelTransit();
    }

}
