import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data/data.service';
import {NcpPayment} from '../model/ncp-payment';
import {DateRange} from '../date-range';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

@Component({
    selector: 'app-ncp-payments',
    templateUrl: './ncp-payments.component.html',
    styleUrls: ['./ncp-payments.component.css']
})
export class NcpPaymentsComponent implements OnInit, AfterViewInit {

    ncpPayments = [];
    displayedColumns = ['ID', 'nameSender', 'sum', 'rnnSender', 'accountSender', 'knp', 'details', 'status', 'managers', 'Mobipay', 'distribution'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    dataSource = new MatTableDataSource <NcpPayment> ();
    isLoading = true;

    constructor(private dataService: DataService) {
        this.dataSource = new MatTableDataSource(this.ncpPayments);
    }

    ngOnInit() {
    }

    onRowClicked(row) {
        console.log('Row clicked: ', row);
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    ngAfterViewInit() {
        let dr = new DateRange('2018-08-01T09:00:00.000Z', '2018-08-01T10:00:00.000Z');
        this.dataService.getNcpPayments(dr).subscribe(data => {
                this.ncpPayments = data;
                this.isLoading = false;
            },
            error2 => this.isLoading = false);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

}
