import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data/data.service';
import {NcpPayment} from '../model/ncp-payment';
import {DateRange} from '../data/date-range';
import {MatDatepickerInputEvent, MatPaginator, MatSort, MatTableDataSource, MatSnackBar} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {RestResponse} from '../data/rest-response';
import {DialogService} from '../dialog/dialog.service';
import {FormControl} from '@angular/forms';
import {NGXLogger} from 'ngx-logger';
import {timeouts, msgs, localStorageTokenName, PaymentStatusRu} from '../settings';

@Component({
    selector: 'app-ncp-payments',
    templateUrl: './ncp-payments.component.html',
    styleUrls: ['./ncp-payments.component.css']
})

export class NcpPaymentsComponent implements OnInit, AfterViewInit {

    ncpPayments = [];
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
    dataSource = new MatTableDataSource<NcpPayment>();
    isWait = true;
    resultsLength = 0;
    selection = new SelectionModel<NcpPayment>(true, []);
    restResponse = new RestResponse();
    pickerStartDate = new FormControl(new Date());
    pickerEndDate = new FormControl(new Date());
    isBadgeVisible = false;
    selectedItems: number = 0;

    constructor(private dataService: DataService,
                private dialogService: DialogService,
                private logger: NGXLogger,
                public snackBar: MatSnackBar) {
        this.dataSource = new MatTableDataSource(this.ncpPayments);
        let nowStartDay;
        let nowEndDay;
        nowStartDay = new Date();
        nowStartDay.setHours(0, 0, 0, 0);
        nowEndDay = new Date();
        nowEndDay.setHours(23, 59, 59, 999);
        this.pickerStartDate.setValue(nowStartDay);
        this.pickerEndDate.setValue(nowEndDay);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.getData();
        //this.getSampleData();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    onRowClicked(paymentRow) {
        console.log('Row clicked: ', paymentRow);
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    getData() {
        this.isWait = true;
        this.dataSource.data = [];
        let dr = new DateRange(this.pickerStartDate.value.getTime(), this.pickerEndDate.value.getTime());
        this.dataService.getNcpPayments(dr).subscribe(data => {
                this.ncpPayments = data;
                this.updateStatusRu();
                this.dataSource.data = data;
                this.resultsLength = data.length;
            },
            error2 => {
                this.showMsg(msgs.msgErrLoadData);
                this.logger.error(msgs.msgErrLoadData);
                this.isWait = false;
            },
            () => {
                this.isWait = false;
            });
    }

    getSampleData() {
        this.dataService.getNcpPaymentsJson().subscribe(data => {
            this.ncpPayments = data;
            this.updateStatusRu();
            this.dataSource.data = data;
            this.resultsLength = data.length;
            //console.log(this.dataSource.data);
        }, () => {
        }, () => {
            this.isWait = false;
        });
    }

    processForSelect(paymentRow) {
        if (!paymentRow.isChecked) {
            this.selectedItems++;
            paymentRow.isChecked = true;
        } else {
            paymentRow.isChecked = false;
            this.selectedItems--;
        }
        if (this.selectedItems > 0) {
            this.isBadgeVisible = true;
        } else {
            this.isBadgeVisible = false;
        }
    }

    toTransit(payment) {
        this.dialogService.setWait();
        this.dataService.paymentToTransit(payment.id).subscribe(data => {
                this.restResponse = data;
                if (data.result == 'ok') {
                    this.dialogService.addItem('Платёж ID:' + payment.id, ', результат: Успешно, (transitPaymentDocNumId = ' + data.data.transitPaymentDocNumId + ')');
                    this.logger.info(msgs.msgSuccessToTransit + ' ID платежа ' + payment.id + ' TRANSIT_PDOC_ID ' + payment.transitPaymentDocNumId);
                    payment.status = data.data.status;
                    this.setStatusRu(payment);
                } else {
                    this.dialogService.addItem('Платёж ID:' + payment.id, ', результат: Неудача, ' + data.data + ' (' + data.result + ')');
                    this.logger.warn(msgs.msgErrToTransit + ' ID платежа ' + payment.id + '. ' + data.data + ' (' + data.result + ')');
                }
            },
            error2 => {
                this.dialogService.addItem('Платёж ID:' + payment.id, ', результат: ' + msgs.msgErrToTransit);
                this.logger.error(msgs.msgErrToTransit + ' ID платежа ' + payment.id + '. ' + error2);
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
            this.showMsg('Не выбрано ни одного платежа');
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
            if (!row.isChecked)
                row.isChecked = true;
            else
                row.isChecked = false;
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

    showMsg(text) {
        this.openSnackBar(text, '');
        setTimeout(function () {
        }.bind(this), timeouts.timeoutAfterLoginInput);
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: timeouts.showMsgDelay,
        });
    }

    rowMenuToTransit(paymentRow) {
        this.dialogService.clear();
        this.dialogService.title = 'Перевод на транзитный счёт';
        this.dialogService.openDialog();
        this.toTransit(paymentRow);
    }

    deleteTransit(payment) {
        this.dialogService.setWait();
        this.dataService.deleteTransitPayment(payment.id, localStorage.getItem(localStorageTokenName)).subscribe(data => {
                this.restResponse = data;
                if (data.result == 'ok') {
                    this.dialogService.addItem('Платёж ID:' + payment.id, ', результат: Успешно');
                    this.logger.info(msgs.msgSuccessDelTransit + ' ID платежа ' + payment.id);
                    payment.status = data.data.status;
                    this.setStatusRu(payment);
                } else {
                    this.dialogService.addItem('Платёж ID:' + payment.id, ', результат: Неудача, ' + data.data + ' (' + data.result + ')');
                    this.logger.warn(msgs.msgErrDelTransit + ' ID платежа ' + payment.id + '. ' + data.data + ' (' + data.result + ')');
                }
            },
            error2 => {
                this.dialogService.addItem('Платёж ID:' + payment.id, ', результат: ' + msgs.msgErrDelTransit + ' (' + error2 + ')');
                this.logger.error(msgs.msgErrDelTransit + ' ID платежа ' + payment.id + '. ' + error2);
                this.dialogService.setWaitNot();
            },
            () => {
                this.dialogService.setWaitNot();
            });
    }

    rowMenuDeleteTransit(paymentRow) {
        this.dialogService.clear();
        this.dialogService.title = 'Удалнение с тразитного счёта';
        this.dialogService.openDialog();
        this.deleteTransit(paymentRow);
    }

    setStatusRu(payment) {
        payment.statusRu = PaymentStatusRu[payment.status];
    }

    updateStatusRu()    {
        this.ncpPayments.forEach(payment => {
            this.setStatusRu(payment);
        })
    }
}

