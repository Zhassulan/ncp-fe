import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {AppService} from '../../app.service';
import {ExcelService} from '../../excel/excel.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import {PublicRegistryRepository} from '../public-registry-repository';
import {ProgressBarService} from '../../progress-bar.service';
import {DateRangeService} from '../../date-range/date-range.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PublicRegistryInDto} from '../dto/public-registry-in-dto';
import {DateRangeMills} from '../../payments/model/date-range-mills';
import {PaginationParams} from '../../payments/model/pagination-params';
import {SORTING} from '../../settings';
import {PublicRegistryService} from '../public-registry.service';
import {concatMap, tap} from 'rxjs';

const DEFAULT_SORT_COLUMN = 'created';

@Component({
  selector: 'app-registries',
  templateUrl: './registries.component.html',
  styleUrls: ['./registries.component.scss']
})
export class RegistriesComponent implements AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['ID',
    'created',
    'bin',
    'company',
    'phone',
    'email',
    'total',
    'rowMenu'
  ];
  dataSource: MatTableDataSource<PublicRegistryInDto> = new MatTableDataSource();
  paginatorResultsLength = 0;
  pageSize = 10;
  totalRows = 0;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 30];
  inputBin;

  constructor(private appService: AppService,
              private excelService: ExcelService,
              private router: Router,
              private publicRegistryReposity: PublicRegistryRepository,
              private progressBarService: ProgressBarService,
              private dateRangeService: DateRangeService,
              private snackbar: MatSnackBar,
              private route: ActivatedRoute,
              private publicRegistryService: PublicRegistryService) {

    this.dateRangeService.dateRangeAnnounced$.subscribe(() => {
      if (this.dateRangeService.isInvalidLoadDataRequest()) {
        this.snackbar.open('Нет данных', 'OK');
      } else {
        this.loadData(this.dateRangeService.dateRange, undefined);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    let minDate: number;
    let maxDate: number;
    this.publicRegistryService.minDate(undefined).pipe(
      tap(res => minDate = res),
      concatMap(() => this.publicRegistryService.maxDate(undefined)),
      tap(res => maxDate = res),
    ).subscribe({
      next: () => {
        this.dateRangeService.announceDateRange(new DateRangeMills(minDate, maxDate));
        this.dateRangeService.announceAfterDate(minDate);
        this.dateRangeService.announceBeforeDate(maxDate);
      },
      error: (err) => this.snackbar.open(err.error)
    });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData(this.dateRangeService.dateRange, undefined);
  }

  save() {
    this.excelService.save(this.dataSource.data);
  }

  menuOnRegistryOpen(registry) {
    this.router.navigate([`registries/${registry.id}`]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.loadData(this.dateRangeService.dateRange, filterValue);
  }

  loadData(dateRange: DateRangeMills, bin: string) {
    this.progressBarService.start();
    this.publicRegistryService.findAll(bin,
      dateRange,
      new PaginationParams(this.currentPage,
        this.pageSize,
        DEFAULT_SORT_COLUMN,
        SORTING.DESC))
      .subscribe(data => {
          this.dataSource.data = data.content;
          setTimeout(() => {
            this.paginator.pageIndex = this.currentPage;
            this.paginator.length = data.totalElements;
          });
        }, error => {
          console.log(error);
          this.snackbar.open('Ошибка! ' + error, 'OK');
          this.progressBarService.stop();
        },
        () => {
          this.progressBarService.stop();
        });
  }
}
