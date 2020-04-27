import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-report',
    templateUrl: './dlg-result.component.html',
    styleUrls: ['./dlg-result.component.css']
})
export class DlgResultComponent implements  OnInit, AfterViewInit {

    ngOnInit(): void {    }

    ngAfterViewInit(): void {    }

    constructor(public dialogRef: MatDialogRef<DlgResultComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

}
