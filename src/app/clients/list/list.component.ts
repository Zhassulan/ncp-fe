import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Client} from './model/client';
import {MatPaginator} from '@angular/material/paginator';
import {ClientDataService} from '../../data/client-data-service';
import {NotificationsService} from 'angular2-notifications';
import {AppService} from '../../app.service';
import {MatSort} from '@angular/material/sort';

@Component({
    selector: 'app-clents-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

    clients = [];
    displayedColumns: string[] = ['No', 'name', 'bin', 'managedBy', 'types', 'segments', 'payments'];
    dataSource = new MatTableDataSource<Client>(this.clients);
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private clientDataService: ClientDataService,
                private notifService: NotificationsService,
                private appService: AppService) {
        this.loadData();
    }

    ngOnInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    loadData() {
        this.appService.setProgress(true);
        this.clientDataService.list().subscribe(
            data => {
                this.clients = data;
                this.dataSource.data = this.clients;
            },
            error => {
                this.notifService.error(error);
              this.appService.setProgress(false);
            },
            () => {
              this.appService.setProgress(false);
            });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

}
