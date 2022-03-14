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
import {PublicRegistryRepository} from '../public-registry-repository';
import {Subscription} from 'rxjs';
import {ProgressBarService} from '../../progress-bar.service';

@Component({
  selector: 'app-registries',
  templateUrl: './registries.component.html',
  styleUrls: ['./registries.component.scss']
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
  paginatorResultsLength = 0;
  pageSize = 30;
  pageSizeOptions: number[] = [30, 60, 100, 150, 250, 300];
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
              private registryService: PublicRegistryRepository,
              private progressBarService: ProgressBarService) {
  }

  ngOnInit() {
    this.dateRangeComponent.setTime();
    this.registries();
    this.setPaginator();
  }

  registries() {
    this.progressBarService.start();
    this.subscription = this.registryService.range(this.dateRangeComponent.pickerStartDate.value.getTime(),
      this.dateRangeComponent.pickerEndDate.value.getTime(), null).subscribe(
      data => {
        this.dataSource.data = data;
        if (data.length > 0) {
          this.setCalendar(new Date(Math.min.apply(null, this.dataSource.data.map(i => i.created))),
            new Date(Math.max.apply(null, this.dataSource.data.map(i => i.created))));
        }
      },
      error => {
        this.notifService.error(error.message);
        this.progressBarService.stop();
      },
      () => this.progressBarService.stop());
  }

  setCalendar(start, end) {
    this.dateRangeComponent.setDates(start, end);
  }

  range() {
    this.progressBarService.start();
    this.subscription = this.registryService.range(this.dateRangeComponent.start, this.dateRangeComponent.end, this.binFormCtl.value)
      .subscribe(data => this.dataSource.data = data,
        error => {
          this.notifService.error(error.message);
          this.progressBarService.stop();
        },
        () => this.progressBarService.stop());
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
    this.progressBarService.stop();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
