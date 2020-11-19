import {AfterContentChecked, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Subscription} from 'rxjs';
import {TemplateService} from '../template.service';
import {TemplateDetail} from '../model/template-detail';
import {Template} from '../model/template';

@Component({
    selector: 'app-template-details-table',
    templateUrl: './template-details-table.component.html',
    styleUrls: ['./template-details-table.component.scss']
})
export class TemplateDetailsTableComponent implements OnInit, AfterContentChecked {

    @Input() template: Template;
    displayedColumns = [
        'no',
        'msisdn',
        'account',
        'sum',
        'menu'];
    dataSource = new MatTableDataSource();
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor() {    }

    ngOnInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    stub(item) {    }

    ngAfterContentChecked(): void {
        if (this.template)
            if (this.dataSource.data.length == 0) this.dataSource.data = this.template.details;
    }

}
