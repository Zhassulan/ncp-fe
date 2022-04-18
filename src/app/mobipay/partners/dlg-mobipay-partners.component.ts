import {AfterViewInit, Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {AppService} from '../../app.service';
import {NotificationsService} from 'angular2-notifications';
import {ProgressBarService} from '../../progress-bar.service';
import {MobipayService} from '../mobipay.service';

@Component({
  selector: 'app-partners',
  templateUrl: './dlg-mobipay-partners.component.html',
  styleUrls: ['./dlg-mobipay-partners.component.scss']
})
export class DlgMobipayPartnersComponent implements OnInit, AfterViewInit, OnDestroy {

  dataSource;
  displayedColumns: string[] = ['code', 'name', 'account', 'bin'];
  @Input() paymentId;
  subscription: Subscription;

  constructor(private dlgRef: MatDialogRef<DlgMobipayPartnersComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private mobipayService: MobipayService,
              private appService: AppService,
              private notifService: NotificationsService,
              private progressBarService: ProgressBarService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.progressBarService.start();
    this.subscription = this.mobipayService.partners(this.data.paymentId).subscribe(
      data => this.dataSource = data,
      error => {
        this.notifService.error(error.message);
        this.progressBarService.stop();
      },
      () => this.progressBarService.stop());
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onRowClick(row) {
    this.dlgRef.close(row);
  }
}
