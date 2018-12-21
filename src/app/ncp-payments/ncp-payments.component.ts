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
    displayedColumns = ['ID', 'nameSender', 'sum', 'rnnSender', 'accountSender', 'knp', 'paymentDetails', 'status', 'managers', 'select']; //, 'Mobipay', 'distribution'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dataSource = new MatTableDataSource<NcpPayment>();
    isLoading = true;
    resultsLength = 0;
    selection = new SelectionModel<NcpPayment>(true, []);
    restResponse = new RestResponse();

    pickerStartDate = new FormControl(new Date());
    pickerEndDate = new FormControl(new Date());

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
        this.dataSource.data = [];
        this.isLoading = true;
        let dr = new DateRange(this.pickerStartDate.value, this.pickerEndDate.value);
        this.dataService.getNcpPayments(dr).subscribe(data => {
                this.ncpPayments = data;
                this.dataSource.data = data;
                this.resultsLength = data.length;
                this.isLoading = false;
            },
            error2 => this.isLoading = false);
    }

    getSampleData() {
        this.isLoading = true;
        this.dataService.getNcpPaymentsJson().subscribe(data => {
                this.ncpPayments = data;
                this.dataSource.data = data;
                this.resultsLength = data.length;
                this.isLoading = false;
                //console.log(this.dataSource.data);
            },
            error2 => this.isLoading = false);
    }

    processForSelect(paymentRow) {
        if (!paymentRow.isChecked)
            paymentRow.isChecked = true;
        else
            paymentRow.isChecked = false;
    }

    toTransit() {
        this.dialogService.clear();
        this.dialogService.title = 'Отчёт по разноске на транзитный счёт';
        this.isLoading = true;
        this.dataSource.data.forEach(payment => {
            if (payment.isChecked) {
                this.dataService.paymentToTransit(new Id(payment.id)).subscribe(data => {
                        this.restResponse = data;
                        this.dialogService.addItem('Платёж ID:' + payment.id, ', результат: ' + data.data + '(' + data.result + ')');
                        if (data.result == 'ok') {
                            console.log('updated payment status:\n' + data.data.status);
                            payment.status = data.data.status;
                        };
                    },
                    error2 => this.isLoading = false,
                    () => {
                        this.isLoading = false;
                        //this.getData();
                    });
            }
        });
        this.openDialog();
    }

    catchStartDatePickerEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        if (type == 'input') {
            //console.log(event.value);
        }
    }

    catchEndDatePickerEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        if (type == 'input') {
            let end = new Date(this.pickerEndDate.value);
            end.setHours(23, 59, 59, 999);
            this.pickerEndDate.setValue(end);
            //console.log(event.value);
            //console.log(this.pickerStartDate.value);
            //console.log(this.pickerEndDate.value);
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
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

}

