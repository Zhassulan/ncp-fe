import {Component, Input, isDevMode, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';
import {PaymentRepository} from '../../payment/paymet-repository';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {DlgService} from '../../dialog/dlg.service';
import {ExcelService} from '../../excel/excel.service';
import {PaymentStatus} from '../../settings';

@Component({
    selector: 'app-raw-table',
    templateUrl: './raw-table.component.html',
    styleUrls: ['./raw-table.component.scss']
})
export class RawTableComponent implements OnInit {

    displayedColumns = [
        'ID',
        'nameSender',
        'sum',
        'rnnSender',
        'account',
        'knp',
        'paymentDetails'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    dataSource = new MatTableDataSource<any>();
    paginatorResultsLength = 0;
    pageSize = 30;
    pageSizeOptions: number[] = [50, 100, 150, 250, 300];
    PaymentStatus = PaymentStatus;
    @Input() dateRangeComponent;
    @Input() selection;
    private subscription: Subscription;

    constructor(private payDataService: PaymentRepository,
                private appService: AppService,
                private notifService: NotificationsService,
                private router: Router,
                private dialogService: DlgService,
                private excelService: ExcelService) {
    }

    ngOnInit(): void {
        this.setPaginator();
        this.loadData();
    }

    setPaginator() {
        this.paginatorResultsLength = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    loadData() {
        if (isDevMode()) {
            this.dateRangeComponent.start = '2019-12-29T00:00:00.000';
            this.dateRangeComponent.end = '2019-12-31T23:59:59.999';
        }
        this.appService.setProgress(true);
        this.subscription = this.payDataService.raw(this.dateRangeComponent.start, this.dateRangeComponent.end).subscribe(
            data => {
                this.dataSource.data = data;
            },
            error => {
                this.appService.setProgress(false);
                this.notifService.error(error.message);
            },
            () => this.appService.setProgress(false));
    }

    export() {
        this.selection.selected.length > 0 ? this.excelService.save(this.selection.selected) : this.excelService.save(this.dataSource.data);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
