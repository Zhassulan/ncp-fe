import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {ClientPayment} from './client-payment';
import {MatPaginator} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientDataService} from '../../data/client-data-service';
import {NotificationsService} from 'angular2-notifications';
import {AppService} from '../../app.service';
import {Subscription} from 'rxjs';
import {PaymentService} from '../../payments/payment/payment.service';
import {ClientService} from '../client.service';

@Component({
    selector: 'app-client-payments-table',
    templateUrl: './client-payments-table.component.html',
    styleUrls: ['./client-payments-table.component.css']
})
export class ClientPaymentsTableComponent implements OnInit {

    displayedColumns: string[] = ['position', 'created', 'payDocNum', 'sum', 'agent', 'status'];
    dataSource = new MatTableDataSource<ClientPayment>();
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    subscription: Subscription;

    constructor(private route: ActivatedRoute,
                private clntDataService: ClientDataService,
                private notifService: NotificationsService,
                private appService: AppService,
                private router: Router,
                private clntService: ClientService) {
        this.subscription = this.clntService.clntPayAnnounced$.subscribe(payments => {
            this.dataSource.data = payments;
            this.dataSource.paginator = this.paginator;
        });
    }

    ngOnInit(): void {
        this.load(this.route.snapshot.params['id']);
    }

    load(id) {
        this.clntService.payments(id);
    }

    onRowClicked(row) {
        //this.router.navigate(['payments/' + row.id]);
    }

}
