import {Component} from '@angular/core';
import {MatDialog} from '@angular/material';
import {DialogComponent} from './dialog/dialog.component';
import {Router} from '@angular/router';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.css']
})
export class UploadComponent {

    dialogRef;

    constructor(public dialog: MatDialog,
                private router: Router) {
    }

    public openUploadDialog() {
        this.dialogRef = this.dialog.open(DialogComponent, {width: '50%', height: '30%'});
    }

}
