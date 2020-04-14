import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ClientPayment} from './client-payment';
import {MatPaginator} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientDataService} from '../../data/client-data-service';
import {NotificationsService} from 'angular2-notifications';
import {AppService} from '../../app.service';

@Component({
    selector: 'app-client-payments-table',
    templateUrl: './client-payments-table.component.html',
    styleUrls: ['./client-payments-table.component.css']
})
export class ClientPaymentsTableComponent implements OnInit {

    displayedColumns: string[] = ['position', 'created', 'payDocNum', 'sum', 'agent', 'status'];
    dataSource = new MatTableDataSource<ClientPayment>();
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(private route: ActivatedRoute,
                private clntDataService: ClientDataService,
                private notifService: NotificationsService,
                private appService: AppService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.dataSource.paginator = this.paginator;
        this.load(this.route.snapshot.params['id']);
    }

    load(id) {
        this.appService.setProgress(true);
        this.clntDataService.payments(id).subscribe(
            data => this.dataSource.data = data,
            error => {
                this.notifService.error(error.error.errm);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    onRowClicked(row) {
        this.router.navigate(['payments/' + row.id]);
    }

}
