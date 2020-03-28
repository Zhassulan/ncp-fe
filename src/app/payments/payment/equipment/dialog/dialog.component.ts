import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {PaymentService} from '../../payment.service';
import {RouterService} from '../../../../router/router.service';
import {AppService} from '../../../../app.service';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

    @ViewChild('file', {static: true}) file;
    fileObj: File;
    showUploadButton: boolean = false;

    constructor(public dialogRef: MatDialogRef<DialogComponent>,
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
        this.routerService.registryFromFile(this.fileObj).subscribe(
            data => {
                if (this.paymentService.payment)
                    this.paymentService.addDetailsFromFilePayment();
                this.dialogRef.close();
            },
            error2 => {
                this.appService.setProgress(false);
            },
            () => {
                this.appService.setProgress(false);
            });
    }

}
