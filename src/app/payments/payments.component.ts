import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DialogService} from '../dialog/dialog.service';
import {PaymentsService} from './payments.service';
import {PaymentService} from './payment/payment.service';
import {UserService} from '../user/user.service';
import {Router} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {msgs, PaymentStatus} from '../settings';
import {Subscription} from 'rxjs';
import {AppService} from '../app.service';
import {ExcelService} from '../excel/excel.service';
import {DateRangeComponent} from '../date-range/date-range.component';
import {Utils} from '../utils';
import {NotificationsService} from 'angular2-notifications';
import {Payment} from './payment/model/payment';
import {PayDataService} from '../data/pay-data-service';

@Component({
    selector: 'app-payments',
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit, AfterViewInit {

    displayedColumns = [
        'ID',
        'creationDate',
        'nameSender',
        'sum',
        'rnnSender',
        'accountSender',
        'accountRecipient',
        'knp',
        'paymentDetails',
        'managedBy',
        'statusRu',
        'distributeDate',
        'select',
        'rowMenu'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    //источник данных для таблицы
    dataSource = new MatTableDataSource<Payment>();
    //общее количество для пагинации
    paginatorResultsLength = 0;
    //выбранные в таблице модели
    selection = new SelectionModel<Payment>(true, []);
    sub: Subscription;
    pageSize = 30;
    pageSizeOptions: number[] = [50, 100, 150, 250, 300];
    PaymentStatus = PaymentStatus;

    @ViewChild(DateRangeComponent, {static: true})
    private dateRangeComponent: DateRangeComponent;

    constructor(private dialogService: DialogService,
                private paymentsService: PaymentsService,
                private userService: UserService,
                private router: Router,
                private paymentService: PaymentService,
                private appService: AppService,
                private excelService: ExcelService,
                private notif: NotificationsService,
                private payDataService: PayDataService
    ) {
        this.dataSource = new MatTableDataSource(this.paymentsService.payments);
        this.paginatorResultsLength = 0;
    }

    ngOnInit() {
        this.loadData();
        this.setPaginator();
    }

    ngAfterViewInit() {

    }

    setPaginator() {
        this.paginatorResultsLength = this.paymentsService.paginatorResultsLength;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    ngOnDestroy() {
        //this.sub.unsubscribe();
    }

    onRowClicked(paymentRow) {
        //this.menuOnRowOpenPayment(paymentRow);
    }

    /**
     * фильтр для поля быстрого поиска
     * @param {string} filterValue
     */
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    loadData() {
        //this.getFileData();
        this.loadServerData();
    }

    /**
     * загрузка платежей с сервера
     */
    loadServerData() {
        this.appService.setProgress(true);
        this.dateRangeComponent.setCalendarToDate('2019-12-31T00:00:00.000', '2019-12-31T23:59:59.999');
        this.dateRangeComponent.setTimeBoundariesForDatePickers();
        this.dataSource.data = [];
        let stDt = this.dateRangeComponent.pickerStartDate.value.getTime();
        let enDt = this.dateRangeComponent.pickerEndDate.value.getTime();
        this.sub = this.payDataService.all(stDt, enDt).subscribe(data => {
                this.paymentsService.initStatusRu(data);
                this.dataSource.data = data;
            },
            error => {
                this.appService.setProgress(false);
                this.notif.error(error);
            },
            () => this.appService.setProgress(false));
    }

    /**
     * загрузка платежей из json файла в папке assets (режим разработки/отладки, чтобы быстро загрузить данные)
     */
    getFileData() {
        this.appService.setProgress(true);
        this.dataSource.data = [];
        this.sub = this.payDataService.json().subscribe(data => {
            this.dataSource.data = data;
        }, error => {
            this.notif.error(msgs.msgErrLoadData);
            this.appService.setProgress(false);
        }, () => this.appService.setProgress(false));
    }

    /**
     * перенос платежа на транзитный счёт NCP (TRANSIT_ACCOUNT = 163761406L)
     * @param payment
     */
    transit(id) {
        let msg;
        this.appService.setProgress(true);
        this.sub = this.paymentsService.toTransit(id).subscribe(data => {
                this.dialogService.addItem(`ID ${id} OK - TRANSIT_PDOC_ID ${data.transitPaymentDocNumId}`);
                this.dialogService.addItem(msg);
            },
            error => {
                console.log(error);
                this.dialogService.addItem(`ID ${id} Ошибка - ${error.error.errm}`);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    transitSelected() {
        if (this.selection.selected.length > 0) {
            this.dialogService.clear();
            this.dialogService.title = 'Перевод на транзитный счёт';
            this.dialogService.openDialog();
            this.selection.selected.forEach(payment => {
                this.transit(payment);
            });
        } else {
            this.notif.warn(msgs.msgNotSelected);
        }
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        if (this.isAllSelected()) {
            this.selection.clear();
        } else {
            if (this.selection.selected.length > 0) {
                this.selection.clear();
            } else {
                this.dataSource.filteredData.forEach(row => this.selection.select(row));
            }
        }
    }

    selectAll() {
        let filteredData = this.dataSource.filteredData;
        filteredData.forEach(row => {
            this.selection.select(row);
        });
    }

    /** The statusLabel for the checkbox on the passed row */
    checkboxLabel(row?: Payment): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${this.selection.selected.length}`;
    }

    menuOnRowToTransit(payment) {
        this.dialogService.clear();
        this.dialogService.title = 'Перевод на транзитный счёт';
        this.dialogService.openDialog();
        this.transit(payment.id);
    }

    transitDel(payment) {
        let msg;
        this.appService.setProgress(true);
        this.sub = this.paymentsService.delTransit(payment.id).subscribe(data => {
                payment = data;
                this.dialogService.addItem(msgs.msgSuccessDelTransit + ' ID платежа ' + payment.id + this.userService.logUser());
            },
            error => {
                msg = msgs.msgErrDelTransit + ' ID платежа ' + payment.id + '. ' + error + this.userService.logUser();
                this.dialogService.addItem(msg);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    menuOnRowDeleteTransit(paymentRow) {
        this.dialogService.clear();
        this.dialogService.title = 'Удалнение с тразитного счёта';
        this.dialogService.openDialog();
        this.transitDel(paymentRow);
    }

    menuOnRowOpenPayment(paymentRow) {
        this.router.navigate(['payments/' + paymentRow.id]);
    }


    export() {
        this.selection.selected.length > 0 ? this.excelService.save(this.selection.selected) : this.excelService.save(this.dataSource.data);
    }

}
