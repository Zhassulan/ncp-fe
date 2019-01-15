import {Component} from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';
import {UploadFilePaymentService} from './upload-file-payment.service';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent  {

    dialogRef;

    constructor(public dialog: MatDialog, private uploadService: UploadFilePaymentService) {}

    public openUploadDialog() {
        this.dialogRef = this.dialog.open(DialogComponent, { width: '50%', height: '30%'});
        this.dialogRef.afterClosed().subscribe(result => {
            //console.log(this.uploadService.filePayment);
        });
    }

}
