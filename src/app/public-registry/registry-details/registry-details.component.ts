import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {RegistryDetail} from '../model/registry-detail';


@Component({
    selector: 'app-registry-details',
    templateUrl: './registry-details.component.html',
    styleUrls: ['./registry-details.component.scss']
})
export class RegistryDetailsComponent implements OnInit {

    dataSource = new MatTableDataSource<RegistryDetail>();
    displayedColumns: string [] = [ 'num', 'msisdn', 'amount'];
    paginatorResultsLength = 0;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @Input() details;

    constructor() { }

    ngOnInit() {
        this.dataSource.data = this.details;
        this.paginatorResultsLength = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

}
