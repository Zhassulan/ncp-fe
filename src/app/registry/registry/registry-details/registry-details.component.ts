import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {
    RegistryDetailsTableCols,
    RegistryDetailTableColsDisplay
} from '../../../settings';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {RegistryDetail} from '../../model/registry-detail';
import {Subscription} from 'rxjs';
import {Registry} from '../../model/registry';
import {register} from 'ts-node';
import {RegistryService} from '../../registry.service';

@Component({
    selector: 'app-registry-details',
    templateUrl: './registry-details.component.html',
    styleUrls: ['./registry-details.component.css']
})
export class RegistryDetailsComponent implements OnInit {

    subscription: Subscription;
    dataSource = new MatTableDataSource<RegistryDetail>();
    columnsDisplay = RegistryDetailTableColsDisplay;
    columns: string[] = RegistryDetailsTableCols;
    i: number = 0;
    paginatorResultsLength: number = 0;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private registryService: RegistryService) {
    }

    ngOnInit() {
        this.subscription = this.registryService.registryAnnounced$.subscribe(
            data => {
                this.dataSource.data = data.details;
                this.setPaginator();
            });
    }

    setPaginator()  {
        this.paginatorResultsLength = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

}
