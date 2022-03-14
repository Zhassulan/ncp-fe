import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatDialogRef} from '@angular/material/dialog';
import {AppService} from '../../../app.service';
import {MobipayService} from '../../mobipay.service';
import {NotificationsService} from 'angular2-notifications';
import {ProgressBarService} from '../../../progress-bar.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dlg-import-limits.component.html',
  styleUrls: ['./dlg-import-limits.component.scss']
})
export class DlgImportLimitsComponent implements OnInit, OnDestroy {

  @ViewChild('file', {static: true}) file;
  fileObj: File;
  showUploadButton = false;
  private subscription: Subscription;

  constructor(public dialogRef: MatDialogRef<DlgImportLimitsComponent>,
              private mobipayService: MobipayService,
              private appService: AppService,
              private notifService: NotificationsService,
              private progressBarService: ProgressBarService) {
  }

  ngOnInit(): void {
  }

  addFile() {
    this.file.nativeElement.click();
  }

  onFileAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (const key in files) {
      if (!isNaN(parseInt(key, 10))) {
        this.fileObj = files[key];
        this.showUploadButton = true;
      }
    }
  }

  upload() {
    this.progressBarService.start();
    this.subscription = this.mobipayService.updateLimits(this.fileObj).subscribe(
      () => this.dialogRef.close(),
      error => {
        this.notifService.error(error);
        this.progressBarService.stop();
      },
      () => this.progressBarService.stop());
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
