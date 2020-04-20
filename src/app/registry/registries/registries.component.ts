import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {NotificationsService} from 'angular2-notifications';
import {AppService} from '../../app.service';
import {ExcelService} from '../../excel/excel.service';
import {Router} from '@angular/router';
import {RegistryReportItem} from '../model/registry-report-item';
import {DateRangeComponent} from '../../date-range/date-range.component';
import {FormControl, Validators} from '@angular/forms';
import {RegistryDataService} from '../../data/registry-data.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-registries',
    templateUrl: './registries.component.html',
    styleUrls: ['./registries.component.css']
})
export class RegistriesComponent implements OnInit, OnDestroy {

    displayedColumns = [
        'ID',
        'created',
        'bin',
        'company',
        'phone',
        'email',
        'msisdn',
        'amount',
        'rowMenu'
    ];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    dataSource = new MatTableDataSource<RegistryReportItem>();
    paginatorResultsLength: number;
    pageSize = 30;
    pageSizeOptions: number[] = [50, 100, 150, 250, 300];
    binFormCtl = new FormControl('', [
        Validators.pattern('\\d{12}'),
    ]);
    @ViewChild(DateRangeComponent, {static: true})
    private dateRangeComponent: DateRangeComponent;
    private subscription: Subscription;

    constructor(private notifService: NotificationsService,
                private appService: AppService,
                private excelService: ExcelService,
                private router: Router,
                private registryService: RegistryDataService) {
    }

    ngOnInit() {
        this.all();
        this.setPaginator();
    }

    all() {
        this.appService.setProgress(true);
        this.subscription = this.registryService.all().subscribe(
            data => this.dataSource.data = data,
            error => {
                this.notifService.error(error);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    range() {
        this.dateRangeComponent.setTimeBoundariesForDatePickers();
        this.appService.setProgress(true);
        this.subscription = this.registryService.range(this.dateRangeComponent.pickerStartDate.value.getTime(), this.dateRangeComponent.pickerEndDate.value.getTime(), this.binFormCtl.value).subscribe(
            data => this.dataSource.data = data,
            error => {
                this.notifService.error(error);
                this.appService.setProgress(false);
            },
            () => this.appService.setProgress(false));
    }

    setPaginator() {
        this.paginatorResultsLength = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    }

    save() {
        this.excelService.save(this.dataSource.data);
    }

    onRowClicked(registry) {
        //this.menuOnRegistryOpen(registry);
    }

    menuOnRegistryOpen(registry) {
        this.router.navigate([`registries/${registry.id}`]);
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    clearBin() {
        this.binFormCtl.setValue('');
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
