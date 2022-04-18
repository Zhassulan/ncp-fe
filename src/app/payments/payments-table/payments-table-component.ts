import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {PaymentsService} from '../payments.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {DateRangeMills} from '../model/date-range-mills';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {PaymentDto} from '../../payment/dto/paymentDto';
import {GetPaymentsPaginationParams} from '../model/get-payments-pagination-params';
import {PaymentStatusRuPipe} from '../payment-status-ru-pipe';
import {PaymentStatus, PaymentStatusRu, SORTING} from '../../settings';
import {Message} from '../../message';
import {Payment} from '../../payment/model/payment';
import {concatMap, tap} from 'rxjs';
import {ProgressBarService} from '../../progress-bar.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MobipayService} from '../../mobipay/mobipay.service';
import {DlgService} from '../../dialog/dlg.service';
import {PaymentRepository} from '../../payment/paymet-repository';
import {ClientProfileService} from '../../clients/profile/client-profile.service';
import {PaymentService} from '../../payment/payment.service';
import {DateRangeService} from '../../date-range/date-range.service';
import {ExcelService} from '../../excel/excel.service';
import {ClientPaymentsComponent} from '../../clients/client-payments/client-payments.component';
import {DlgMobipayPartnersComponent} from '../../mobipay/partners/dlg-mobipay-partners.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

const DEFAULT_SORT_COLUMN = 'creationDate';

@Component({
  selector: 'app-payments-table',
  templateUrl: './payments-table-component.html',
  styleUrls: ['./payments-table-component.scss']
})
export class PaymentsTableComponent implements AfterViewInit {

  paymentStatusRuPipe: PaymentStatusRuPipe;
  pageSize = 10;
  totalRows = 0;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 30];
  dataSource: MatTableDataSource<PaymentDto> = new MatTableDataSource();
  displayedColumns: string [] = ['paymentId',
    'nameSender',
    'sum',
    'rnnSender',
    'details',
    'status',
    'account',
    'creationDate',
    'rowMenu'];
  PaymentStatus = PaymentStatus;
  dialogRef;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private paymentsService: PaymentsService,
              private paymentService: PaymentService,
              private progressBarService: ProgressBarService,
              private snackbar: MatSnackBar,
              private router: Router,
              private mobipayService: MobipayService,
              private dialogService: DlgService,
              private payDataService: PaymentRepository,
              private profileService: ClientProfileService,
              private dateRangeService: DateRangeService,
              private excelService: ExcelService,
              private route: ActivatedRoute,
              private dlg: MatDialog) {

    this.dateRangeService.dateRangeAnnounced$.subscribe(() => {
      if (this.isInvalidLoadDataRequest()) {
        this.snackbar.open('Нет данных', 'OK');
      } else {
        this.loadData(this.dateRangeService.dateRange, this.route.snapshot.data.component === 'ClientPaymentsComponent' ?
          this.route.snapshot.params['id'] : undefined);
      }
    });
  }

  isInvalidLoadDataRequest(): boolean {
    return (!this.dateRangeService.dateRange || (!this.dateRangeService.dateRange.after || false) ||
      (!this.dateRangeService.dateRange.before || false));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadData(dateRange: DateRangeMills, profileId: number) {
    this.progressBarService.start();
    this.paymentsService.getPayments(dateRange,
      profileId,
      new GetPaymentsPaginationParams(this.currentPage,
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

  sortData(sort: Sort) {
    // this.loadData(sort);
  }

  isMobipayComponent(): boolean {
    return this.route.snapshot.data.component === 'ClientPaymentsComponent';
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData(this.dateRangeService.dateRange, this.route.snapshot.data.component === 'ClientPaymentsComponent' ?
      this.route.snapshot.params['id'] : undefined);
  }

  menuOnRowOpenPayment(paymentRow) {
    this.router.navigate(['payments/' + paymentRow.id]);
  }

  menuOnRowDeleteTransit(payment) {
    this.dialogService.clear();
    this.dialogService.title = 'Удаление с тразитного счёта';
    this.dialogService.openDialog();
    this.transitDel(payment.id);
  }

  menuOnRowTransit(payment) {
    this.dialogService.clear();
    this.dialogService.title = 'Перевод на транзитный счёт';
    this.dialogService.openDialog();
    this.transit(payment.id);
  }

  transit(id) {
    this.progressBarService.start();
    this.payDataService.transit(id).subscribe(
      data => {
        const payment = this.dataSource.data.find(x => x.id === id);
        payment.status = data.status;
        // payment.statusRu = PaymentStatusRu[payment.status];
        this.dialogService.addItem(`ID ${id} OK - TRANSIT_PDOC_ID ${data.transitPdocNumId}`);
      },
      error => {
        this.dialogService.addItem(`ID ${id} Ошибка - ${error.message}`);
        this.progressBarService.stop();
      },
      () => this.progressBarService.stop());
  }

  transitDel(id) {
    this.progressBarService.start();
    this.payDataService.transitDel(id).subscribe(
      data => {
        const payment = this.dataSource.data.find(x => x.id === id);
        payment.status = data.status;
        // payment.statusRu = PaymentStatusRu[payment.status];
        this.dialogService.addItem(`ID ${id} OK - TRANSIT_PDOC_ID ${data.transitPdocNumId}`);
      },
      error => {
        this.dialogService.addItem(`ID ${id} Ошибка - ${error}`);
        this.progressBarService.stop();
      },
      () => this.progressBarService.stop());
  }

  menuOnRowChangeMobipay(payment: Payment) {
    this.changeMobipay(payment);
  }

  changeMobipay(payment: Payment) {
    let isMobipay;
    let profileId;
    this.progressBarService.start();
    this.mobipayService.change(payment.id).pipe(
      tap(res => {
        profileId = res;
        if (profileId == null) {
          throw new Error('Возможно для данного профиля нет мобипей профиля.');
        }
      }),
      concatMap(() => this.profileService.isMobipay(profileId)),
      tap(res => isMobipay = res),
    ).subscribe({
      next: () => this.snackbar.open(isMobipay ? 'Успешно переведен в Mobipay платеж' : 'Успешно переведен в обычный платеж', 'OK'),
      error: (err) => {
        this.snackbar.open('Ошибка! ' + err, 'OK');
        this.progressBarService.stop();
      },
      complete: () => this.progressBarService.stop()
    });
  }

  canTransit(row) {
    return this.paymentService.canTransitByPayment(row);
  }

  canDelTransit(row) {
    return this.paymentService.canDelTransitByPayment(row);
  }

  export() {
    this.excelService.save(this.dataSource.data);
  }

  menuOnRowDistributeMobipay(row) {
    this.distributeMobipay(row);
  }

  distributeMobipay(row) {
    this.dialogRef = this.dlg.open(DlgMobipayPartnersComponent, {
      width: '60%', height: '30%',
      data: {
        'paymentId': row.id
      },
      disableClose: true
    });
    this.dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.snackbar.open(Message.WAR.MOBIPAY_PICK_PARTNER);
        return;
      }
      this.progressBarService.start();
      this.mobipayService.distribute(row.id, row.status === PaymentStatus.DISTRIBUTED, result.code).subscribe(
        data => {
          this.snackbar.open(data.status === PaymentStatus.DISTRIBUTED ?
            Message.OK.MOBIPAY_DISTR : data.status === PaymentStatus.NEW ?
              Message.OK.MOBIPAY_CANCELED : Message.OK.PROCESSED);
          row.status = data.status;
          row.statusRu = PaymentStatusRu[data.status];
        },
        error => {
          this.snackbar.open('Ошибка! ' + error.message, 'OK');
          this.progressBarService.stop();
        },
        () => this.progressBarService.stop());
    });
  }

  canMobipayDistribute(row) {
    return row.status === PaymentStatus.NEW;
  }

  canMobipayCancel(row) {
    return row.status === PaymentStatus.DISTRIBUTED;
  }

  canChangeMobipay(row) {
    return row.status === PaymentStatus.NEW;
  }
}
