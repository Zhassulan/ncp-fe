import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {NGXLogger} from 'ngx-logger';
import {DateRange} from '../data/date-range';
import {DialogService} from '../dialog/dialog.service';
import {DataService} from '../data/data.service';
import {PaymentsService} from './payments.service';
import {PaymentService} from './payment/payment.service';
import {UserService} from '../user/user.service';
import {Router} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {msgs, rests} from '../settings';
import {Subscription} from 'rxjs';
import {AppService} from '../app.service';
import {ExcelService} from '../excel/excel.service';
import {DateRangeComponent} from '../date-range/date-range.component';
import {Utils} from '../utils';
import {VNcpPayment} from './model/vncp-payment';
import {NotificationsService} from 'angular2-notifications';

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
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    //источник данных для таблицы
    dataSource = new MatTableDataSource<VNcpPayment>();
    //общее количество для пагинации
    paginatorResultsLength: number;
    //выбранные в таблице модели
    selection = new SelectionModel<VNcpPayment>(true, []);
    sub: Subscription;
    pageSize = 30;
    pageSizeOptions: number[] = [50, 100, 150, 250, 300];

    @ViewChild(DateRangeComponent, { static: true })
    private dateRangeComponent: DateRangeComponent;

    constructor(private dataService: DataService,
                private dialogService: DialogService,
                private logger: NGXLogger,
                private paymentsService: PaymentsService,
                private userService: UserService,
                private router: Router,
                private paymentService: PaymentService,
                private appService: AppService,
                private excelService: ExcelService,
                private notif: NotificationsService
                ) {
        this.dataSource = new MatTableDataSource(this.paymentsService.payments);
        this.paginatorResultsLength = 0;
    }


    ngOnInit() {

        this.getData();
        this.setPaginator();
    }

    ngAfterViewInit()   {
        this.appService.checkVersion();
    }

    setPaginator()  {
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

    getData()   {
        //this.getFileData();
        this.getServerData();
    }

    /**
     * загрузка платежей с сервера
     */
    getServerData() {
        this.dateRangeComponent.setCalendarToDate('2019-12-10T00:00:00.000', '2019-12-10T23:59:59.999');
        this.dateRangeComponent.setTimeBoundariesForDatePickers();
        this.appService.setProgress(true);
        this.dataSource.data = [];
        let stDt = this.dateRangeComponent.pickerStartDate.value.getTime();
        let enDt = this.dateRangeComponent.pickerEndDate.value.getTime();
        console.log('Загрузка платежей за время ' + Utils.convertMillsToDate(stDt)+ ' - ' + Utils.convertMillsToDate(enDt));
        let dr = new DateRange(stDt, enDt);
        this.sub = this.dataService.getNcpPayments(dr).subscribe(data => {
                this.paymentsService.updateStatusRu(data);
                this.dataSource.data = data;
            },
            error2 => {
                console.log(error2);
                this.notif.error(msgs.msgErrLoadData);
                this.logger.error(msgs.msgErrLoadData + ' ' + error2);
                this.appService.setProgress(false);
            },
            () => {
                this.appService.setProgress(false);
                if (this.dataSource.data.length == 0)   {
                    this.notif.info(msgs.msgNoData);
                }
            });
    }

    /**
     * загрузка платежей из json файла в папке assets (режим разработки/отладки, чтобы быстро загрузить данные)
     */
    getFileData() {
        this.appService.setProgress(true);
        this.dataSource.data = [];
        this.sub = this.dataService.getNcpPaymentsJson().subscribe(data => {
            this.dataSource.data = data;
        }, error2 => {
            this.notif.error(msgs.msgErrLoadData);
            this.appService.setProgress(false);
        }, () => {
            this.appService.setProgress(false);
        });
    }

    /**
     * перенос платежа на транзитный счёт NCP (TRANSIT_ACCOUNT = 163761406L)
     * @param payment
     */
    toTransit(payment) {
        let msg;
        this.appService.setProgress(true);
        this.sub = this.paymentsService.toTransit(payment.id).subscribe(data => {
                if (data.result == rests.restResultOk) {
                    payment = data.data;
                    msg = msgs.msgSuccessToTransit + ' ID платежа ' + payment.id + ' TRANSIT_PDOC_ID ' + data.data.transitPaymentDocNumId + this.userService.logUser();
                    this.logger.info(msg);
                    this.dialogService.addItem(msg);
                } else {
                    msg = msgs.msgErrToTransit + ' ID платежа ' + payment.id + '. ' + data.data + ' (' + data.result + ')' + this.userService.logUser();
                    this.logger.warn(msg);
                    this.dialogService.addItem(msg);
                }
            },
            error2 => {
                msg = msgs.msgErrToTransit + ' ID платежа ' + payment.id + '. ' + error2 + this.userService.logUser();
                this.logger.error(msg);
                this.dialogService.addItem(msg);
                this.appService.setProgress(false);
            },
            () => {
                this.appService.setProgress(false);
            });
    }

    toTransitSelected() {
        if (this.selection.selected.length > 0) {
            this.dialogService.clear();
            this.dialogService.title = 'Перевод на транзитный счёт';
            this.dialogService.openDialog();
            this.selection.selected.forEach(payment => {
                this.toTransit(payment);
            });
        } else {
            this.notif.warn(msgs.msgNotSelected)
        }
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        if (this.isAllSelected())   {
            this.selection.clear();
        }   else    {
            if (this.selection.selected.length > 0) {
                this.selection.clear()
            }   else    {
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

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: VNcpPayment): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${this.selection.selected.length}`;
    }

    menuOnRowToTransit(paymentRow) {
        this.dialogService.clear();
        this.dialogService.title = 'Перевод на транзитный счёт';
        this.dialogService.openDialog();
        this.toTransit(paymentRow);
    }

    deleteTransit(payment) {
        let msg;
        this.appService.setProgress(true);
        this.sub = this.paymentsService.deleteTransit(payment.id).subscribe(data => {
                if (data.result == rests.restResultOk) {
                    payment = data.data;
                    msg = msgs.msgSuccessDelTransit + ' ID платежа ' + payment.id + this.userService.logUser();
                    this.logger.info(msg);
                    this.dialogService.addItem(msg);
                } else {
                    msg = msgs.msgErrDelTransit + ' ID платежа ' + payment.id + '. ' + data.data + ' (' + data.result + ')' + this.userService.logUser();
                    this.logger.warn(msg);
                    this.dialogService.addItem(msg);
                }
            },
            error2 => {
                msg = msgs.msgErrDelTransit + ' ID платежа ' + payment.id + '. ' + error2 + this.userService.logUser();
                this.logger.error(msg);
                this.dialogService.addItem(msg);
                this.appService.setProgress(false);
            },
            () => {
                this.appService.setProgress(false);
            });
    }

    menuOnRowDeleteTransit(paymentRow) {
        this.dialogService.clear();
        this.dialogService.title = 'Удалнение с тразитного счёта';
        this.dialogService.openDialog();
        this.deleteTransit(paymentRow);
    }

    menuOnRowOpenPayment(paymentRow) {
        this.paymentService.setPayment(paymentRow.id);
        this.router.navigate(['payment/' + paymentRow.id]);
    }


    export()    {
        this.selection.selected.length > 0 ? this.excelService.save(this.selection.selected) : this.excelService.save(this.dataSource.data);
    }

}
