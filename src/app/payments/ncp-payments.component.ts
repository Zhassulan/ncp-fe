import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data/data.service';
import {NcpPayment} from './model/ncp-payment';
import {DateRange} from '../data/date-range';
import {MatDatepickerInputEvent, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {DialogService} from '../dialog/dialog.service';
import {FormControl} from '@angular/forms';
import {NGXLogger} from 'ngx-logger';
import {msgs, shrinkDetailsColumnSize, rests} from '../settings';
import {PaymentsService} from './payments.service';
import {UserService} from '../user/user.service';
import {Router} from '@angular/router';
import {PaymentService} from './payment/payment.service';
import {NotificationsService} from 'angular2-notifications';

@Component({
    selector: 'app-ncp-payments',
    templateUrl: './ncp-payments.component.html',
    styleUrls: ['./ncp-payments.component.css']
})

export class NcpPaymentsComponent implements OnInit, AfterViewInit {
    //локальная коллекия платежей - синхронизируется  с сервисной коллекцией
    payments = [];
    //отображаемые в таблице колонки
    displayedColumns = [
        'ID',
        'nameSender',
        'sum',
        'rnnSender',
        'accountSender',
        'knp',
        'paymentDetails',
        'managers',
        'statusRu',
        'select',
        'rowMenu']; //, 'Mobipay', 'distribution'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    //источник данных для таблицы
    dataSource = new MatTableDataSource<NcpPayment>();
    //индикатор полосы прогресса\загрузки
    isWait = true;
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
    //объект диапазон дат
    lastDateRange: DateRange;
    //даты начала и конца дня
    dtStartDay: Date;
    dtEndDay: Date;

    constructor(private dataService: DataService,
                private dialogService: DialogService,
                private logger: NGXLogger,
                private paymentsService: PaymentsService,
                private userService: UserService,
                private router: Router,
                private paymentService: PaymentService,
                private notifService: NotificationsService) {
        this.dataSource = new MatTableDataSource(this.payments);
        this.dtStartDay = new Date();
        this.dtEndDay = new Date();
        this.paginatorResultsLength = 0;
    }

    ngOnInit() {
        //если нет данных в сервисе, загружаем согласно текущей дате
        if (this.paymentsService.payments.length == 0) {
            //обработка установленной даты с начала и до конца
            this.dtStartDay.setHours(0, 0, 0, 0);
            this.dtEndDay.setHours(23, 59, 59, 999);
            this.pickerStartDate.setValue(this.dtStartDay);
            this.pickerEndDate.setValue(this.dtEndDay);
            //загрузка платежей онлайн
            //this.getData();
            //загрузка фейковых платежей
            this.getSampleData();
            this.dataSource.data = this.payments;
        } else {
            //в противном случае загружаем данные из сервиса, исключение повторного обращения к серверу
            if (this.paymentsService.lastDateRange) {
                this.lastDateRange = this.paymentsService.lastDateRange;
                this.dtStartDay.setTime(this.lastDateRange.startDate);
                this.dtEndDay.setTime(this.lastDateRange.endDate);
                this.pickerStartDate.setValue(this.dtStartDay);
                this.pickerEndDate.setValue(this.dtEndDay);
            }
            this.payments = this.paymentsService.payments;
            this.dataSource.data = [];
            this.dataSource.data = this.payments;
            this.isWait = false;
        }
    }

    ngAfterViewInit() {
        this.paginatorResultsLength = this.paymentsService.paginatorResultsLength;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    onRowClicked(paymentRow) {
        //console.log('Row clicked: ', paymentRow);
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

    /**
     * загрузка платежей
     */
    getData() {
        this.isWait = true;
        this.dataSource.data = [];
        let dr = new DateRange(this.pickerStartDate.value.getTime(), this.pickerEndDate.value.getTime());
        this.paymentsService.lastDateRange = dr;
        this.paymentsService.getData(dr).subscribe(data => {
                this.payments = data;
                this.dataSource.data = this.payments;
                this.paymentsService.paginatorResultsLength = this.paginatorResultsLength;
            },
            error2 => {
                this.notifService.error(msgs.msgErrLoadData + ' ' + error2);
                this.isWait = false;
            },
            () => {
                this.isWait = false;
            });
    }

    /**
     * загрузка платежей (фейковые данные) из json файла в папке assets (режим разработки/отладки, чтобы быстро загрузить данные)
     */
    getSampleData() {
        this.isWait = true;
        this.dataSource.data = [];
        this.paymentsService.getSampleData().subscribe(data => {
            this.payments = data;
            this.dataSource.data = this.payments;
            this.paymentsService.paginatorResultsLength = this.paginatorResultsLength;
        }, error2 => {
            this.notifService.error(msgs.msgErrLoadData + ' ' + error2);
            this.isWait = false;
        }, () => {
            this.isWait = false;
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
        this.dialogService.setWait();
        this.paymentsService.toTransit(payment.id).subscribe(data => {
                if (data.result == rests.restResultOk) {
                    payment = data.data;
                    msg = msgs.msgSuccessToTransit + ' ID платежа ' + payment.id + ' TRANSIT_PDOC_ID ' + data.data.transitPaymentDocNumId + this.userService.logUser();
                    this.logger.info(msg);
                    this.dialogService.addItem(null, msg);
                } else {
                    msg = msgs.msgErrToTransit + ' ID платежа ' + payment.id + '. ' + data.data + ' (' + data.result + ')' + this.userService.logUser();
                    this.logger.warn(msg);
                    this.dialogService.addItem(null, msg);
                }
            },
            error2 => {
                msg = msgs.msgErrToTransit + ' ID платежа ' + payment.id + '. ' + error2 + this.userService.logUser();
                this.logger.error(msg);
                this.dialogService.addItem(null, msg);
                this.dialogService.setWaitNot();
            },
            () => {
                this.dialogService.setWaitNot();
            });
    }

    toTransitSelected() {
        if (this.selectedItems > 0) {
            this.dialogService.clear();
            this.dialogService.title = 'Перевод на транзитный счёт';
            this.dialogService.openDialog();
            this.dataSource.data.forEach(payment => {
                if (payment.isChecked) {
                    this.toTransit(payment);
                }
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

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ? this.clearSelection() : this.selectAll();
    }

    selectAll() {
        this.selectedItems = 0;
        this.dataSource.data.forEach(row => {
            this.selection.select(row);
            this.selectedItems++;
            !row.isChecked ? row.isChecked = true : row.isChecked = false;
        });
        this.isBadgeVisible = true;
    }

    clearSelection() {
        this.selection.clear();
        this.dataSource.data.forEach(row => {
            row.isChecked = false;
        });
        this.isBadgeVisible = false;
        this.selectedItems = 0;
    }

    menuOnRowToTransit(paymentRow) {
        this.dialogService.clear();
        this.dialogService.title = 'Перевод на транзитный счёт';
        this.dialogService.openDialog();
        this.toTransit(paymentRow);
    }

    deleteTransit(payment) {
        let msg;
        this.dialogService.setWait();
        this.paymentsService.deleteTransit(payment.id).subscribe(data => {
                if (data.result == rests.restResultOk) {
                    payment = data.data;
                    msg = msgs.msgSuccessDelTransit + ' ID платежа ' + payment.id + this.userService.logUser();
                    this.logger.info(msg);
                    this.dialogService.addItem(null, msg);
                } else {
                    msg = msgs.msgErrDelTransit + ' ID платежа ' + payment.id + '. ' + data.data + ' (' + data.result + ')' + this.userService.logUser();
                    this.logger.warn(msg);
                    this.dialogService.addItem(null, msg);
                }
            },
            error2 => {
                msg = msgs.msgErrDelTransit + ' ID платежа ' + payment.id + '. ' + error2 + this.userService.logUser();
                this.logger.error(msg);
                this.dialogService.addItem(null, msg);
                this.dialogService.setWaitNot();
            },
            () => {
                this.dialogService.setWaitNot();
            });
    }

    menuOnRowDeleteTransit(paymentRow) {
        this.dialogService.clear();
        this.dialogService.title = 'Удалнение с тразитного счёта';
        this.dialogService.openDialog();
        this.deleteTransit(paymentRow);
    }

    menuOnRowDistributeEquipment(paymentRow)  {
        this.paymentService.setPayment(paymentRow.id);
        this.router.navigate(['payment'])
    }

}
