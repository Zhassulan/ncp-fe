import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDatepickerInputEvent, MatPaginator, MatSort, MatTable, MatTableDataSource, PageEvent} from '@angular/material';
import {NGXLogger} from 'ngx-logger';
import {DateRange} from '../data/date-range';
import {NcpPayment} from './model/ncp-payment';
import {DialogService} from '../dialog/dialog.service';
import {NotificationsService} from 'angular2-notifications';
import {DataService} from '../data/data.service';
import {PaymentsService} from './payments.service';
import {FormControl} from '@angular/forms';
import {PaymentService} from './payment/payment.service';
import {UserService} from '../user/user.service';
import {Router} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {msgs, rests, shrinkDetailsColumnSize} from '../settings';
import {environment} from '../../environments/environment';
import {Subscription} from 'rxjs';
import {AppService} from '../app.service';
import {ExcelService} from '../excel/excel.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

    //отображаемые в таблице колонки
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
        'managers',
        'statusRu',
        'distributeDate',
        'select',
        'rowMenu']; //, 'Mobipay', 'distribution'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    //источник данных для таблицы
    dataSource = new MatTableDataSource<NcpPayment>();
    //общее количество для пагинации
    paginatorResultsLength: number;
    //выбранные в таблице модели
    selection = new SelectionModel<NcpPayment>(true, []);
    //объекты выбора даты на странице
    pickerStartDate = new FormControl(new Date());
    pickerEndDate = new FormControl(new Date());
    //индикатор для отображения\скрытия количества выделенных
    isBadgeVisible = false;
    //подсчёт выбранных элементов
    selectedItems: number = 0;
    //обрезка больших текстов в деталях\назначение платежа
    shrinkDetailsColumnSize = shrinkDetailsColumnSize;
    //даты начала и конца дня
    dtStartDay: Date;
    dtEndDay: Date;
    sub: Subscription;
    // MatPaginator Inputs
    pageSize = 30;
    pageSizeOptions: number[] = [50, 100, 150, 250, 300];

    constructor(private dataService: DataService,
                private dialogService: DialogService,
                private logger: NGXLogger,
                private paymentsService: PaymentsService,
                private userService: UserService,
                private router: Router,
                private paymentService: PaymentService,
                private notifService: NotificationsService,
                private appService: AppService,
                private excelService: ExcelService,
                ) {

        this.dataSource = new MatTableDataSource(this.paymentsService.payments);
        this.dtStartDay = new Date();
        this.dtEndDay = new Date();
        this.paginatorResultsLength = 0;
    }

    ngOnInit() {
        if (!environment.production) {
            this.setCalendarToDate('2019-07-02T00:00:00.000', '2019-07-02T23:59:59.999');
        }
        this.getData();
        this.setPaginator();
    }

    setPaginator()  {
        this.paginatorResultsLength = this.paymentsService.paginatorResultsLength;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {
        //this.sub.unsubscribe();
    }

    /**
     *  Установить границы времени для календарей диапазона дат
     */
    setTimeBoundariesForDatePickers() {
        this.dtStartDay = new Date(this.pickerStartDate.value.getTime());
        this.dtEndDay = new Date(this.pickerEndDate.value.getTime());
        this.dtStartDay.setHours(0, 0, 0, 0);
        this.dtEndDay.setHours(23, 59, 59, 999);
        this.pickerStartDate.setValue(this.dtStartDay);
        this.pickerEndDate.setValue(this.dtEndDay);
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
        this.getServerData();
        //this.getFileData();
    }

    /**
     * загрузка платежей с сервера
     */
    getServerData() {
        this.setTimeBoundariesForDatePickers();
        this.appService.setProgress(true);
        this.dataSource.data = [];
        let dr = new DateRange(this.pickerStartDate.value.getTime(), this.pickerEndDate.value.getTime());
        this.sub = this.paymentsService.getData(dr).subscribe(data => {
                this.dataSource.data = data;
                //this.dataSource.data = this.paymentsService.payments;
            },
            error2 => {
                this.notifService.error(msgs.msgErrLoadData);
                this.appService.setProgress(false);
            },
            () => {
                this.appService.setProgress(false);
                if (this.dataSource.data.length == 0)   {
                    this.notifService.warn(msgs.msgErrNoDataFound);
                }
            });
    }

    /**
     * загрузка платежей из json файла в папке assets (режим разработки/отладки, чтобы быстро загрузить данные)
     */
    getFileData() {
        this.appService.setProgress(true);
        this.dataSource.data = [];
        this.sub = this.paymentsService.getSampleData().subscribe(data => {
            this.dataSource.data = data;
        }, error2 => {
            this.notifService.error(msgs.msgErrLoadData);
            this.appService.setProgress(false);
        }, () => {
            this.appService.setProgress(false);
        });
    }

    /**
     * фиксирование количества выделенных в таблице платежей и установка атрибута класса платёж в статус отмеченный
     * @param paymentRow
     */
    processForSelect(paymentRow) {
        if (!paymentRow.isChecked) {
            this.selectedItems++;
            paymentRow.isChecked = true;
        } else {
            paymentRow.isChecked = false;
            this.selectedItems--;
        }
        //скрытие\показ кружочка с количеством выделенные в кнопке ТРАНЗИТ
        this.selectedItems > 0 ? this.isBadgeVisible = true : this.isBadgeVisible = false;
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
            this.notifService.warn('Не выбрано ни одного платежа');
        }
    }

    catchEndDatePickerEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        if (type == 'input') {
            let end = new Date(this.pickerEndDate.value);
            end.setHours(23, 59, 59, 999);
            this.pickerEndDate.setValue(end);
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
    checkboxLabel(row?: NcpPayment): string {
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
                    this.dialogService.addItem( msg);
                } else {
                    msg = msgs.msgErrDelTransit + ' ID платежа ' + payment.id + '. ' + data.data + ' (' + data.result + ')' + this.userService.logUser();
                    this.logger.warn(msg);
                    this.dialogService.addItem( msg);
                }
            },
            error2 => {
                msg = msgs.msgErrDelTransit + ' ID платежа ' + payment.id + '. ' + error2 + this.userService.logUser();
                this.logger.error(msg);
                this.dialogService.addItem( msg);
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

    setCalendarToDate(startDate, endDate) {
        let dtStartDay = new Date(startDate);
        let dtEndDay = new Date(endDate);
        dtStartDay.setHours(0, 0, 0, 0);
        dtEndDay.setHours(23, 59, 59, 999);
        //console.log(dtStartDay);
        //console.log(dtEndDay);
        this.pickerStartDate.setValue(dtStartDay);
        this.pickerEndDate.setValue(dtEndDay);
    }

    export()    {
        this.selection.selected.length > 0 ? this.excelService.save(this.selection.selected) : this.excelService.save(this.dataSource.data);
    }

}
