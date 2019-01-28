import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {UploadFilePaymentService} from '../upload-file-payment.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

    @ViewChild('file') file;
    fileObj: File;
    isWait: boolean = true;
    showUploadButton: boolean = false;

    constructor(public dialogRef: MatDialogRef<DialogComponent>,
                private uploadService: UploadFilePaymentService,
                private router: Router) {
    }

    ngOnInit() {
        this.isWait = false;
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

    addFile() {
        this.file.nativeElement.click();
    }

    upload() {
        this.isWait = true;
        this.uploadService.upload(this.fileObj).subscribe(
            data => {
                this.isWait = false;
                //this.router.navigate(['filePayment']);
                this.dialogRef.close();
            },
            error2 => {
                this.isWait = false;
            },
            () => {
                this.isWait = false;
            });
    }

}
