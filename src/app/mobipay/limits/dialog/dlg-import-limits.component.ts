import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatDialogRef} from '@angular/material/dialog';
import {AppService} from '../../../app.service';
import {MobipayService} from '../../mobipay.service';

@Component({
    selector: 'app-dialog',
    templateUrl: './dlg-import-limits.component.html',
    styleUrls: ['./dlg-import-limits.component.scss']
})
export class DlgImportLimits implements OnInit {

    @ViewChild('file', {static: true}) file;
    fileObj: File;
    showUploadButton: boolean = false;
    private subscription: Subscription;

    constructor(public dialogRef: MatDialogRef<DlgImportLimits>,
                private mobipayService: MobipayService,
                private appService: AppService) {
    }

    ngOnInit(): void {
    }

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
        this.subscription = this.mobipayService.updateLimits(this.fileObj).subscribe(
            data => {
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
        this.subscription.unsubscribe();
    }

}
