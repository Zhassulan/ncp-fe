import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {PaymentRepository} from '../../payment/payment-repository';
import {AppService} from '../../app.service';
import {Router} from '@angular/router';
import {DlgService} from '../../dialog/dlg.service';
import {ExcelService} from '../../excel/excel.service';
import {PaymentStatus, SORTING} from '../../settings';
import {ProgressBarService} from '../../progress-bar.service';
import {DateRangeService} from '../../date-range/date-range.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PaymentDto} from '../../payment/dto/paymentDto';
import {DateRangeMills} from '../../payments/model/date-range-mills';
import {PaginationParams} from '../../payments/model/pagination-params';
import {concatMap, tap} from 'rxjs';
import {RawPaymentsService} from '../raw-payments.service';

const DEFAULT_SORT_COLUMN = 'creationDate';

@Component({
  selector: 'app-raw-table',
  templateUrl: './raw-table.component.html',
  styleUrls: ['./raw-table.component.scss']
})
export class RawTableComponent implements AfterViewInit {

  pageSize = 10;
  totalRows = 0;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 30];
  dataSource: MatTableDataSource<PaymentDto> = new MatTableDataSource();
  displayedColumns = [
    'ID',
    'nameSender',
    'sum',
    'rnnSender',
    'account',
    'knp',
    'paymentDetails'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  paginatorResultsLength = 0;
  PaymentStatus = PaymentStatus;
  @Input() selection;

  constructor(private payDataService: PaymentRepository,
              private appService: AppService,
              private router: Router,
              private dialogService: DlgService,
              private excelService: ExcelService,
              private progressBarService: ProgressBarService,
              private dateRangeService: DateRangeService,
              private snackbar: MatSnackBar,
              private rawPaymentsService: RawPaymentsService) {

    this.dateRangeService.dateRangeAnnounced$.subscribe(() => {
      if (this.dateRangeService.isInvalidLoadDataRequest()) {
        this.snackbar.open('Нет данных', 'OK');
      } else {
        this.loadData(this.dateRangeService.dateRange);
      }
    });
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData(this.dateRangeService.dateRange);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    let minDate: number;
    let maxDate: number;
    this.rawPaymentsService.minDate().pipe(
      tap(res => minDate = res),
      concatMap(() => this.rawPaymentsService.maxDate()),
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

  setPaginator() {
    this.paginatorResultsLength = this.dataSource.data.length;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  loadData(dateRange: DateRangeMills) {
    this.progressBarService.start();
    this.rawPaymentsService.raw(dateRange,
      new PaginationParams(this.currentPage,
        this.pageSize,
        DEFAULT_SORT_COLUMN,
        SORTING.DESC)).subscribe(
      data => {
        this.dataSource.data = data.content;
        setTimeout(() => {
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = data.totalElements;
        });
      },
      error => {
        this.progressBarService.stop();
        this.snackbar.open('Ошибка! ' + error.message, 'OK');
      },
      () => this.progressBarService.stop()
    );
  }

  export() {
    this.selection.selected.length > 0 ? this.excelService.save(this.selection.selected) : this.excelService.save(this.dataSource.data);
  }
}
