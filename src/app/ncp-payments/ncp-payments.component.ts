import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data/data.service';
import {NcpPayment} from '../model/ncp-payment';
import {DateRange} from '../data/date-range';
import {MatDatepickerInputEvent, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {RestResponse} from '../data/rest-response';
import {Id} from '../data/id';
import {DialogService} from '../dialog/dialog.service';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-ncp-payments',
    templateUrl: './ncp-payments.component.html',
    styleUrls: ['./ncp-payments.component.css']
})

export class NcpPaymentsComponent implements OnInit, AfterViewInit {

    ncpPayments = [];
    displayedColumns = ['ID', 'nameSender', 'sum', 'rnnSender', 'accountSender', 'knp', 'paymentDetails', 'managers', 'status', 'select']; //, 'Mobipay', 'distribution'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dataSource = new MatTableDataSource<NcpPayment>();
    //isLoading = true;
    isWait = true;
    resultsLength = 0;
    selection = new SelectionModel<NcpPayment>(true, []);
    restResponse = new RestResponse();
    pickerStartDate = new FormControl(new Date());
    pickerEndDate = new FormControl(new Date());
    isBadgeVisible = false;
    selectedItems: number = 0;

    constructor(private dataService: DataService, private dialogService: DialogService) {
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
        //this.getData();
        this.getSampleData();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        //console.log(this.pickerStartDate.value);
        //console.log(this.pickerEndDate.value);

    }

    openDialog() {
        this.dialogService.openDialog();
    }

    onRowClicked(paymentRow) {
        //console.log('Row clicked: ', row);
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
                this.dataSource.data = data;
                this.resultsLength = data.length;
            },
            error2 => {
                this.dialogService.clear();
                this.dialogService.title = 'Загрузка данных';
                this.dialogService.addItem('Результат', 'Системная ошибка');
                this.openDialog();
                this.isWait = false;
            },
            () => {
                this.isWait = false;
            });
    }

    getSampleData() {
        this.dataService.getNcpPaymentsJson().subscribe(data => {
            this.ncpPayments = data;
            this.dataSource.data = data;
            this.resultsLength = data.length;
            //console.log(this.dataSource.data);
        }, () => {
        }, () => {
            this.isWait = false;
        });
    }

    processForSelect(paymentRow) {

        if (!paymentRow.isChecked)  {
            this.selectedItems++;
            paymentRow.isChecked = true;
        } else  {
            paymentRow.isChecked = false;
            this.selectedItems--;
        }
        if (this.selectedItems > 0) {
            this.isBadgeVisible = true;
        }   else {
            this.isBadgeVisible = false;
        }
    }

    toTransit() {
        this.isWait = true;
        this.dialogService.clear();
        this.dialogService.title = 'Отчёт по разноске на транзитный счёт';
        this.dataSource.data.forEach(payment => {
            if (payment.isChecked) {
                this.dataService.paymentToTransit(new Id(payment.id)).subscribe(data => {
                        this.restResponse = data;
                        if (data.result == 'ok') {
                            this.dialogService.addItem('Платёж ID:' + payment.id, ', результат: Успешно, (transitPaymentDocNumId = ' + data.data.transitPaymentDocNumId + ')');
                            payment.status = data.data.status;
                        } else {
                            this.dialogService.addItem('Платёж ID:' + payment.id, ', результат: Неудача, ' + data.data + '(' + data.result + ')');
                        }
                        ;
                    },
                    error2 => {
                        this.dialogService.addItem('Платёж ID:' + payment.id, ', результат: Системная ошибка');
                    },
                    () => {

                    });
            }
        });
        this.isWait = false;
        this.openDialog();
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
        this.isAllSelected() ?
            this.clearSelection() :
            this.dataSource.data.forEach(row => {
                this.selection.select(row);
                if (!row.isChecked)
                    row.isChecked = true;
                else
                    row.isChecked = false;
            });
    }

    clearSelection() {
        this.selection.clear();
        this.dataSource.data.forEach(row => {
            row.isChecked = false;
        });
    }

}

