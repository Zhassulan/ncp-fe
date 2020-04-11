import {AfterViewInit, Component, OnInit, ViewChild, isDevMode} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {DialogService} from '../dialog/dialog.service';
import {PaymentService} from './payment/payment.service';
import {UserService} from '../user/user.service';
import {Router} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {PaymentStatus, PaymentStatusRu} from '../settings';
import {AppService} from '../app.service';
import {ExcelService} from '../excel/excel.service';
import {DateRangeComponent} from '../date-range/date-range.component';
import {NotificationsService} from 'angular2-notifications';
import {Payment} from './payment/model/payment';
import {PayDataService} from '../data/pay-data-service';

@Component({
    selector: 'app-payments',
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

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
    pageSize = 30;
    pageSizeOptions: number[] = [50, 100, 150, 250, 300];
    PaymentStatus = PaymentStatus;

    @ViewChild(DateRangeComponent, {static: true})
    private dateRangeComponent: DateRangeComponent;

    constructor(private dialogService: DialogService,
                private userService: UserService,
                private router: Router,
                private paymentService: PaymentService,
                private appService: AppService,
                private excelService: ExcelService,
                private notif: NotificationsService,
                private payDataService: PayDataService
    ) {
        this.dataSource = new MatTableDataSource<Payment>();
        this.paginatorResultsLength = 0;
    }

    ngOnInit() {
        this.loadData();
        this.setPaginator();
    }

    setPaginator() {
        this.paginatorResultsLength = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
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

    loadServerData() {
        this.appService.setProgress(true);
        if (isDevMode())
            this.dateRangeComponent.setCalendarToDate('2019-12-31T00:00:00.000', '2019-12-31T23:59:59.999');
        this.dateRangeComponent.setTimeBoundariesForDatePickers();
        let stDt = this.dateRangeComponent.pickerStartDate.value.getTime();
        let enDt = this.dateRangeComponent.pickerEndDate.value.getTime();
        this.payDataService.all(stDt, enDt).subscribe(data => {
                this.initStatusRu(data);
                this.dataSource.data = data;
            },
            error => {
                this.appService.setProgress(false);
                if (error.status) {
                    if (error.status == 503)
                        this.notif.error(`Сервис не доступен`);
                } else {
                    this.notif.error(error);
                }
            },
            () => this.appService.setProgress(false));
    }

    /**
     * загрузка платежей из json файла в папке assets (режим разработки/отладки, чтобы быстро загрузить данные)
     */
    getFileData() {
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

    /**
     * перенос платежа на транзитный счёт NCP (TRANSIT_ACCOUNT = 163761406L)
     * @param payment
     */
    transit(id) {
        let msg;
        this.appService.setProgress(true);
        this.payDataService.transit(id).subscribe(data => {
                let payment = this.dataSource.data.find(x => x.id == id);
                payment.status = data.status;
                payment.statusRu = PaymentStatusRu[payment.status];
                this.dialogService.addItem(`ID ${id} OK - TRANSIT_PDOC_ID ${data.transitPdocNumId}`);
                this.dialogService.addItem(msg);
            },
            error => {
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
            this.selection.selected.forEach(payment => this.transit(payment.id));
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
        filteredData.forEach(row => this.selection.select(row));
    }

    /** The statusLabel for the checkbox on the passed row */
    checkboxLabel(row?: Payment): string {
        return !row ? `${this.isAllSelected() ? 'select' : 'deselect'} all`
            : `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${this.selection.selected.length}`;
    }

    menuOnRowToTransit(payment) {
        this.dialogService.clear();
        this.dialogService.title = 'Перевод на транзитный счёт';
        this.dialogService.openDialog();
        this.transit(payment.id);
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

    menuOnRowDeleteTransit(payment) {
        this.dialogService.clear();
        this.dialogService.title = 'Удаление с тразитного счёта';
        this.dialogService.openDialog();
        this.transitDel(payment.id);
    }

    menuOnRowOpenPayment(paymentRow) {
        this.router.navigate(['payments/' + paymentRow.id]);
    }


    export() {
        this.selection.selected.length > 0 ? this.excelService.save(this.selection.selected) : this.excelService.save(this.dataSource.data);
    }

    setStatusRu(payment) {
        payment.statusRu = PaymentStatusRu[payment.status];
    }

    setStatusRuOrigin(payment) {
        payment.status = PaymentStatusRu[payment.status];
    }

    initStatusRu(payments) {
        payments.forEach(payment => this.setStatusRu(payment));
    }

}
