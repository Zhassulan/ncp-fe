import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-report',
    templateUrl: './dialog-report.component.html',
    styleUrls: ['./dialog-report.component.css']
})
export class DialogReportComponent implements  OnInit, AfterViewInit {

    ngOnInit(): void {    }

    ngAfterViewInit(): void {    }

    constructor(public dialogRef: MatDialogRef<DialogReportComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
