import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {PaymentService} from '../payment.service';
import {RouterService} from '../../router/router.service';
import {AppService} from '../../app.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-dialog',
    templateUrl: './dlg-import-router-registry.component.html',
    styleUrls: ['./dlg-import-router-registry.component.scss']
})
export class DlgImportRouterRegistryComponent implements OnInit, OnDestroy {

    @ViewChild('file', {static: true}) file;
    fileObj: File;
    showUploadButton: boolean = false;
    private subscription: Subscription;

    constructor(public dialogRef: MatDialogRef<DlgImportRouterRegistryComponent>,
                private routerService: RouterService,
                private paymentService: PaymentService,
                private appService: AppService) {
    }

    ngOnInit() {    }

    addFile() {
        this.file.nativeElement.click();
    }

    onFileAdded() {
        const files: { [key: string]: File } = this.file.nativeElement.files;
        for (let key in files) {
            if (!isNaN(parseInt(key))) {
                this.fileObj = files[key];
                this.showUploadButton = true;
            }
        }
    }

    upload() {
        this.appService.setProgress(true);
        this.subscription = this.routerService.registryFromFile(this.fileObj).subscribe(
            data => {
                if (this.paymentService.payment)
                    this.paymentService.addDetailsFromRouterRegistry();
                this.dialogRef.close();
            },
            error2 => {
                this.appService.setProgress(false);
            },
            () => {
                this.appService.setProgress(false);
            });
    }

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }

}
