import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-dialog-report',
    templateUrl: './dialog-report.component.html',
    styleUrls: ['./dialog-report.component.css']
})
export class DialogReportComponent implements  OnInit, AfterViewInit {

    listHeight: number;
    isWait = false;

    ngOnInit(): void {    }

    ngAfterViewInit(): void {    }

    constructor(public dialogRef: MatDialogRef<DialogReportComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
