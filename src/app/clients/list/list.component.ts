import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {NotificationsService} from 'angular2-notifications';
import {AppService} from '../../app.service';
import {MatSort, Sort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {ClientService} from '../client.service';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DlgImportLimitsComponent} from '../../mobipay/limits/dialog/dlg-import-limits.component';
import {DlgService} from '../../dialog/dlg.service';
import {MobipayService} from '../../mobipay/mobipay.service';
import {ProgressBarService} from '../../progress-bar.service';
import {ClientProfileService} from '../profile/client-profile.service';
import {PaymentStatus, SORTING} from '../../settings';
import {GetPaymentsPaginationParams} from '../../payments/model/get-payments-pagination-params';
import {Profile} from '../model/profile';

const DEFAULT_SORT_COLUMN = 'clientName';

@Component({
  selector: 'app-clents-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy, AfterViewInit {

  limits;
  dataSource: MatTableDataSource<Profile> = new MatTableDataSource();
  private subscription: Subscription;
  pageSize = 10;
  totalRows = 0;
  currentPage = 0;
  pageSizeOptions: number[] = [10, 20, 30];
  displayedColumns: string[] = ['clientName',
    'clientIin',
    'managedBy',
    'types',
    'segments',
    'payments'];
  PaymentStatus = PaymentStatus;
  dialogRef;
  inputClientIIN;
  inputClientName;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() isMobipay: boolean;

  constructor(private clientService: ClientService,
              private notifService: NotificationsService,
              private appService: AppService,
              private router: Router,
              private clntService: ClientService,
              public dlg: MatDialog,
              private dlgService: DlgService,
              private mobipayService: MobipayService,
              private progressBarService: ProgressBarService,
              private profileService: ClientProfileService) {
  }

  ngOnInit(): void {
    this.loadData(undefined,
      undefined,
      this.isMobipay);
  }

  loadData(clientIIN: string,
           clientName: string,
           isMobipay: boolean) {
    this.progressBarService.start();
    this.profileService.getClientsProfile(clientIIN,
      clientName,
      isMobipay,
      new GetPaymentsPaginationParams(this.currentPage,
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
        this.notifService.error(error.message);
        this.progressBarService.stop();
      },
      () => this.progressBarService.stop());
  }

  applyFilterClientIIN() {
    this.inputClientName = undefined;
    this.loadData(this.inputClientIIN,
      undefined,
      this.isMobipay);
  }

  applyFilterClientName() {
    this.inputClientIIN = undefined;
    this.loadData(undefined,
      this.inputClientName,
      this.isMobipay);
  }

  openClientPayments(client) {
    this.clntService.client = client;
    this.router.navigate([`clients/${client.id}/payments`]);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.progressBarService.stop();
  }

  dlgUpdateLimits() {
    const dialogRef = this.dlg.open(DlgImportLimitsComponent, {
      width: '50%',
      data: {limits: this.limits},
      disableClose: true
    });
    let counter = 1;
    dialogRef.afterClosed().subscribe(() => {
      this.dlgService.clear();
      this.mobipayService.limits.forEach(i => {
        this.dlgService.addItem(`${counter++}) код партнера: ${i.partnerCode}`);
        this.dlgService.addItem(`  код результата: ${i.resCode}`);
        this.dlgService.addItem(`  результат: ${i.resMsg}`);
        this.dlgService.addItem(`  лимит: ${i.limit}`);
        this.dlgService.addItem('');
      });
      this.dlgService.openDialog();
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadData(this.inputClientIIN,
      this.inputClientName,
      this.isMobipay);
  }

  sortData(sort: Sort) {
    // this.loadData(sort);
  }
}
