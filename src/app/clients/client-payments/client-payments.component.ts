import {Component, OnInit, ViewChild} from '@angular/core';
import {ClientService} from '../client.service';
import {DateRangeComponent} from '../../date-range/date-range.component';
import {ClientPaymentsTableComponent} from '../client-payments-table/client-payments-table.component';

@Component({
    selector: 'app-client-payments',
    templateUrl: './client-payments.component.html',
    styleUrls: ['./client-payments.component.css']
})
export class ClientPaymentsComponent implements OnInit {

    @ViewChild(DateRangeComponent)
    rangeComponent: DateRangeComponent;
    @ViewChild(ClientPaymentsTableComponent)
    clntPaymentsTableComponent;
    clientId;

    constructor(private clntService: ClientService) {
        //this.route.snapshot.params['id'];
    }

    get client() {
        return this.clntService.client;
    }

    ngOnInit(): void {

    }

    load() {
        //this.rangeComponent.setTime();
        this.clntService.payments(this.client.id, this.rangeComponent.start, this.rangeComponent.end);
    }

    applyFilter(filterValue: string) {
        this.clntPaymentsTableComponent.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.clntPaymentsTableComponent.dataSource.paginator) {
            this.clntPaymentsTableComponent.dataSource.paginator.firstPage();
        }
    }

}
