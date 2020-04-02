import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {
    RegistryDetailsTableCols,
    RegistryDetailTableColsDisplay
} from '../../../settings';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {RegistryDetail} from '../../model/registry-detail';
import {Subscription} from 'rxjs';
import {Registry} from '../../model/registry';
import {register} from 'ts-node';
import {RegistryDataService} from '../../../data/registry-data.service';


@Component({
    selector: 'app-registry-details',
    templateUrl: './registry-details.component.html',
    styleUrls: ['./registry-details.component.css']
})
export class RegistryDetailsComponent implements OnInit {

    dataSource = new MatTableDataSource<RegistryDetail>();
    columnsDisplay = RegistryDetailTableColsDisplay;
    columns: string[] = RegistryDetailsTableCols;
    i: number = 0;
    paginatorResultsLength: number = 0;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @Input() detals;

    constructor(private registryService: RegistryDataService) {
    }

    ngOnInit() {
        this.dataSource.data = this.detals;
        this.setPaginator();
    }

    setPaginator() {
        this.paginatorResultsLength = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

}
