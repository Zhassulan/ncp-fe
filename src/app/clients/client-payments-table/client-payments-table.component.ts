import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {ClientDataService} from '../../data/client-data-service';
import {NotificationsService} from 'angular2-notifications';
import {AppService} from '../../app.service';
import {Subscription} from 'rxjs';
import {ClientService} from '../client.service';
import {PaymentService} from '../../payment/payment.service';
import {DlgService} from '../../dialog/dlg.service';
import {PaymentStatus, PaymentStatusRu} from '../../settings';
import {PayDataService} from '../../data/pay-data-service';
import {Payment} from '../../payment/model/payment';
import {DateRangeComponent} from '../../date-range/date-range.component';
import {MatDialog} from '@angular/material/dialog';
import {DlgMobipayPartnersComponent} from '../../mobipay/partners/dlg-mobipay-partners.component';

@Component({
    selector: 'app-client-payments-table',
    templateUrl: './client-payments-table.component.html',
    styleUrls: ['./client-payments-table.component.css']
})
export class ClientPaymentsTableComponent implements OnInit, OnDestroy {

    displayedColumns: string[] = [
        'position',
        'created',
        'payDocNum',
        'sum',
        'agent',
        'status',
        'menu'];
    dataSource = new MatTableDataSource<Payment>();
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    subscription: Subscription;
    isMobipay;
    @Input() datesRange: DateRangeComponent;
    dialogRef;

    constructor(private route: ActivatedRoute,
                private clntDataService: ClientDataService,
                private notifService: NotificationsService,
                private appService: AppService,
                private router: Router,
                private clntService: ClientService,
                private payService: PaymentService,
                private dlgService: DlgService,
                private payDataService: PayDataService,
                private dlg: MatDialog) {
        this.subscription = this.clntService.clntPayAnnounced$.subscribe(payments => {
            this.dataSource.data = payments;
        });
    }

    ngOnInit(): void {
        this.dataSource.paginator = this.paginator;
        this.isMobipay = this.route.snapshot.params['isMobipay'];
        this.load(this.route.snapshot.params['id']);
    }

    load(id) {
        this.appService.setProgress(true);
        this.clntDataService.payments(id).subscribe(
            data => {
                this.dataSource.data = data;
                let minDate = new Date(Math.min.apply(null, this.dataSource.data.map(i => i.created)));
                let maxDate = new Date(Math.max.apply(null, this.dataSource.data.map(i => i.created)));
                this.datesRange.start = minDate;
                this.datesRange.end = maxDate;
            },
            error => {
                this.appService.setProgress(false);
                this.notifService.error(error.error.errm);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false)
        );
    }

    onRowClicked(row) {
        //this.router.navigate(['payments/' + row.id]);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    menuOnRowOpenPayment(row) {
        this.router.navigate(['payments/' + row.id]);
    }

    canTransit(row) {
        this.payService.setPayment(row);
        return this.payService.canTransit();
    }

    canMobipayDistribute(row) {
        return row.status == PaymentStatus.NEW ||
            row.status == PaymentStatus.TRANSIT ||
            row.status == PaymentStatus.ERROR ||
            row.status == PaymentStatus.TRANSIT_CANCELLED ||
            row.status == PaymentStatus.TRANSIT_ERROR;
    }

    canDelTransit(row) {
        this.payService.setPayment(row);
        return this.payService.canDelTransit();
    }

    menuOnRowToTransit(row) {
        this.dlgService.clear();
        this.dlgService.title = 'Перевод на транзитный счёт';
        this.dlgService.openDialog();
        this.transit(row.id);
    }

    menuOnRowDeleteTransit(payment) {
        this.dlgService.clear();
        this.dlgService.title = 'Удаление с тразитного счёта';
        this.dlgService.openDialog();
        this.transitDel(payment.id);
    }

    transit(id) {
        this.appService.setProgress(true);
        this.payDataService.transit(id).subscribe(
            data => {
                let payment = this.dataSource.data.find(x => x.id == id);
                payment.status = data.status;
                payment.statusRu = PaymentStatusRu[payment.status];
                this.dlgService.addItem(`ID ${id} OK - TRANSIT_PDOC_ID ${data.transitPdocNumId}`);
            },
            error => {
                this.dlgService.addItem(`ID ${id} Ошибка - ${error.error.errm}`);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    transitDel(id) {
        this.appService.setProgress(true);
        this.payDataService.transitDel(id).subscribe(
            data => {
                let payment = this.dataSource.data.find(x => x.id == id);
                payment.status = data.status;
                payment.statusRu = PaymentStatusRu[payment.status];
                this.dlgService.addItem(`ID ${id} OK - TRANSIT_PDOC_ID ${data.transitPdocNumId}`);
            },
            error => {
                this.dlgService.addItem(`ID ${id} Ошибка - ${error.error.errm}`);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    distributeMobipay(row) {
        this.dialogRef = this.dlg.open(DlgMobipayPartnersComponent, {
            width: '60%', height: '30%',
            data: {'paymentId': row.id},
            disableClose: true});
    }

}
