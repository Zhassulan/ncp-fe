import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Client} from './client';
import {MatPaginator} from '@angular/material/paginator';
import {ClientRepository} from '../client-repository';
import {NotificationsService} from 'angular2-notifications';
import {AppService} from '../../app.service';
import {MatSort} from '@angular/material/sort';
import {Router} from '@angular/router';
import {ClientService} from '../client.service';
import {MobipayRepository} from '../../mobipay/mobipay-repository';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {DlgImportLimitsComponent} from '../../mobipay/limits/dialog/dlg-import-limits.component';
import {DlgService} from '../../dialog/dlg.service';
import {MobipayService} from '../../mobipay/mobipay.service';
import {ProgressBarService} from '../../progress-bar.service';

@Component({
  selector: 'app-clents-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {

  limits;
  clients = [];
  displayedColumns: string[] = ['No', 'name', 'bin', 'managedBy', 'types', 'segments', 'payments'];
  dataSource = new MatTableDataSource<Client>(this.clients);
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @Input() isMobipay;
  private subscription: Subscription;

  constructor(private clientDataService: ClientRepository,
              private notifService: NotificationsService,
              private appService: AppService,
              private router: Router,
              private clntService: ClientService,
              private mobipayDataService: MobipayRepository,
              public dlg: MatDialog,
              private dlgService: DlgService,
              private mobipayService: MobipayService,
              private progressBarService: ProgressBarService) {
  }

  ngAfterViewInit() {
    this.loadData();
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData() {
    this.progressBarService.start();
    let req;
    this.isMobipay ? req = this.mobipayDataService.clients() : req = this.clientDataService.all();
    this.subscription = req.subscribe(
      data => {
        this.clients = data;
        this.dataSource.data = this.clients;
      },
      error => {
        this.notifService.error(error.message);
        this.progressBarService.stop();
      },
      () => this.progressBarService.stop());
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openClientPayments(client, isMobipay) {
    this.clntService.client = client;
    this.router.navigate([`clients/${client.id}/payments`, {isMobipay: isMobipay}]);
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
}
