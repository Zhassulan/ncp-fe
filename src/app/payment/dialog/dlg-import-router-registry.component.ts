import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {PaymentService} from '../payment.service';
import {RouterService} from '../../router/router.service';
import {AppService} from '../../app.service';
import {Subscription} from 'rxjs';
import {ProgressBarService} from '../../progress-bar.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dlg-import-router-registry.component.html',
  styleUrls: ['./dlg-import-router-registry.component.scss']
})
export class DlgImportRouterRegistryComponent implements OnInit, OnDestroy {

  @ViewChild('file', {static: true}) file;
  fileObj: File;
  showUploadButton = false;
  private subscription: Subscription;

  constructor(public dialogRef: MatDialogRef<DlgImportRouterRegistryComponent>,
              private routerService: RouterService,
              private paymentService: PaymentService,
              private appService: AppService,
              private progressBarService: ProgressBarService) {
  }

  ngOnInit() {
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
    this.subscription = this.routerService.registryFromFile(this.fileObj).subscribe(
      () => {
        if (this.paymentService.payment) {
          this.paymentService.addDetailsFromRouterRegistry();
        }
        this.dialogRef.close();
      },
      () => this.progressBarService.stop(),
      () => this.progressBarService.stop());
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
