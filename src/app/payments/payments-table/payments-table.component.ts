import {Component, Input, isDevMode, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Payment} from '../../payment/model/payment';
import {PaymentStatus, PaymentStatusRu} from '../../settings';
import {PaymentRepository} from '../../payment/paymet-repository';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';
import {Router} from '@angular/router';
import {DlgService} from '../../dialog/dlg.service';
import {ExcelService} from '../../excel/excel.service';
import {concatMap, Subscription} from 'rxjs';
import {PaymentService} from '../../payment/payment.service';
import {MobipayRepository} from '../../mobipay/mobipay-repository';
import {Message} from '../../message';
import {MobipayService} from '../../mobipay/mobipay.service';
import {ProfileService} from '../../profile/profile.service';
import {PaymentV2Service} from '../../payment/payment-v2.service';
import {ProgressBarService} from '../../progress-bar.service';
import {SnackbarService} from '../../snackbar.service';

@Component({
  selector: 'app-payments-table',
  templateUrl: './payments-table.component.html',
  styleUrls: ['./payments-table.component.scss']
})
export class PaymentsTableComponent implements OnInit, OnDestroy {

  displayedColumns = [
    'ID',
    'nameSender',
    'sum',
    'rnnSender',
    'paymentDetails',
    'statusRu',
    'managedBy',
    'account',
    'knp',
    'select',
    'rowMenu'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource = new MatTableDataSource<Payment>();
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
              private excelService: ExcelService,
              private payService: PaymentService,
              private mobipayDataService: MobipayRepository,
              private mobipayService: MobipayService,
              private profileService: ProfileService,
              private paymentV2Service: PaymentV2Service,
              private progressBarService: ProgressBarService,
              private snackbarService: SnackbarService) {
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

  initStatusRu(payments) {
    payments.forEach(payment => this.setStatusRu(payment));
  }

  setStatusRu(payment) {
    payment.statusRu = PaymentStatusRu[payment.status];
  }

  loadData() {
    if (isDevMode()) {
      this.dateRangeComponent.start = '2019-12-31T00:00:00.000';
      this.dateRangeComponent.end = '2019-12-31T23:59:59.999';
    }
    this.progressBarService.start();
    this.subscription = this.payDataService.range(this.dateRangeComponent.start, this.dateRangeComponent.end).subscribe(
      data => {
        this.initStatusRu(data);
        this.dataSource.data = data;
      },
      error => {
        this.progressBarService.stop();
        this.notifService.error(error.message);
      },
      () => this.progressBarService.stop());
  }

  loadFileData() {
    this.progressBarService.start();
    this.dataSource.data = [];
    this.payDataService.json().subscribe(data => {
        this.dataSource.data = data;
      }, error => {
        this.notifService.error(error.message);
        this.progressBarService.stop();
      },
      () => this.progressBarService.stop());
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() :
      this.selection.selected.length > 0 ? this.selection.clear() : this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  menuOnRowOpenPayment(paymentRow) {
    this.router.navigate(['payments/' + paymentRow.id]);
  }

  menuOnRowMobipay(paymentRow) {
    this.progressBarService.start();
    this.mobipayDataService.change(paymentRow.id, true).subscribe(
      () => this.notifService.info(Message.OK.MOBIPAY_CHANGED),
      error => {
        this.notifService.error(error.message);
        this.progressBarService.stop();
      },
      () => this.progressBarService.stop());
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
        payment.statusRu = PaymentStatusRu[payment.status];
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
        payment.statusRu = PaymentStatusRu[payment.status];
        this.dialogService.addItem(`ID ${id} OK - TRANSIT_PDOC_ID ${data.transitPdocNumId}`);
      },
      error => {
        this.dialogService.addItem(`ID ${id} Ошибка - ${error}`);
        this.progressBarService.stop();
      },
      () => this.progressBarService.stop());
  }

  export() {
    this.selection.selected.length > 0 ? this.excelService.save(this.selection.selected) : this.excelService.save(this.dataSource.data);
  }

  transitSelected() {
    if (this.selection.selected.length > 0) {
      this.dialogService.clear();
      this.dialogService.title = 'Перевод на транзитный счёт';
      this.dialogService.openDialog();
      this.selection.selected.forEach(payment => this.transit(payment.id));
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  canTransit(row) {
    this.payService.setPayment(row);
    return this.payService.canTransit();
  }

  canDelTransit(row) {
    this.payService.setPayment(row);
    return this.payService.canDelTransit();
  }

  canMoveMobipay(row) {
    return this.payService.canMoveMobipay(row);
  }

  menuOnRowMoveMobipay(payment: Payment) {
    this.changeMobipay(payment);
  }

  changeMobipay(payment: Payment) {
    this.progressBarService.start();
    this.paymentV2Service.getPaymentById(payment.id).pipe(
      concatMap(paymentDto => this.profileService.isMobipay(paymentDto.profileId)),
      concatMap(isMobipay => this.mobipayDataService.change(payment.id, isMobipay))
    ).subscribe({
      next: (res) => this.snackbarService.ok('ID профайла ' + res),
      error: (err) => {
        this.snackbarService.err(err.error);
        this.progressBarService.stop();
      },
      complete: () => this.progressBarService.stop()
    });
  }
}
