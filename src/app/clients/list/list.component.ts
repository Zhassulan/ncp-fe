import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Client} from './client';
import {MatPaginator} from '@angular/material/paginator';
import {ClientDataService} from '../../data/client-data-service';
import {NotificationsService} from 'angular2-notifications';
import {AppService} from '../../app.service';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {ClientService} from '../client.service';
import {MobipayDataService} from '../../data/mobipay-data.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-clents-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy{

    clients = [];
    displayedColumns: string[] = ['No', 'name', 'bin', 'managedBy', 'types', 'segments', 'payments'];
    dataSource = new MatTableDataSource<Client>(this.clients);
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @Input() isMobipay;
    private subscription: Subscription;

    constructor(private clientDataService: ClientDataService,
                private notifService: NotificationsService,
                private appService: AppService,
                private router: Router,
                private clntService: ClientService,
                private mobipayDataService: MobipayDataService) {
    }

    ngAfterViewInit() {
        this.loadData();
    }

    ngOnInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    loadData() {
        this.appService.setProgress(true);
        let req;
        this.isMobipay ? req = this.mobipayDataService.clients() : req = this.clientDataService.all();
        this.subscription = req.subscribe(
            data => {
                this.clients = data;
                this.dataSource.data = this.clients;
            },
            error => {
                this.notifService.error(error.message);
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

    openClientPayments(client, isMobipay) {
        this.clntService.client = client;
        this.router.navigate([`clients/${client.id}/payments`, { isMobipay: isMobipay } ]);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    updateLimits() {

    }

}
