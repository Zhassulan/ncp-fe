import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
    selector: 'app-dialog-report',
    templateUrl: './dialog-report.component.html',
    styleUrls: ['./dialog-report.component.css']
})
export class DialogReportComponent implements  OnInit, AfterViewInit {

    listHeight: number;
    isWait = true;

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {

    }

    constructor(public dialogRef: MatDialogRef<DialogReportComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    setStyles() {
        console.log(this.data);
        if (this.data.items.length > 20) {
            this.listHeight = 600;
        }   else    {
            this.listHeight = this.data.items.length * 20;
        }
        this.listHeight = 500;
        let styles = {
            'height': this.listHeight.toString() + 'px'
        };
        return styles;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
