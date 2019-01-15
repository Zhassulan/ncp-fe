import {Component} from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';
import {UploadFilePaymentService} from './upload-file-payment.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent  {

    dialogRef;

    constructor(public dialog: MatDialog,
                private router: Router,
                private uploadService: UploadFilePaymentService) {}

    public openUploadDialog() {
        this.dialogRef = this.dialog.open(DialogComponent, { width: '50%', height: '30%'});
        this.dialogRef.afterClosed().subscribe(result => {
            if (this.uploadService.filePayment) {
                this.router.navigate(['/filePayment']);
            }
        });
    }

}
