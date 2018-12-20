import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data/data.service';
import {NcpPayment} from '../model/ncp-payment';
import {DateRange} from '../date-range';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';

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
    checked: boolean = false;

    constructor(private dataService: DataService) {
        this.dataSource = new MatTableDataSource(this.ncpPayments);
    }

    ngOnInit() {
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

    ngAfterViewInit() {
        this.getSampleData();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    getData() {
        let dr = new DateRange('2018-08-01T09:00:00.000Z', '2018-08-01T10:00:00.000Z');
        this.dataService.getNcpPayments(dr).subscribe(data => {
                this.ncpPayments = data;
                this.dataSource.data = data;
                this.resultsLength = data.length;
                this.isLoading = false;
            },
            error2 => this.isLoading = false);
    }

    getSampleData() {
        this.dataService.getNcpPaymentsJson().subscribe(data => {
                this.ncpPayments = data;
                this.dataSource.data = data;
                this.resultsLength = data.length;
                this.isLoading = false;
                //console.log(this.dataSource.data);
            },
            error2 => this.isLoading = false);
    }

    processForSelect(paymentRow)  {
        if (!paymentRow.isChecked)
            paymentRow.isChecked = true;
        else
            paymentRow.isChecked = false;
    }

    toTransit()    {
        this.dataSource.data.forEach(row => {
            if (row.isChecked) {
                console.log('selected: ' + row.id);
            }
        });
    }

}

