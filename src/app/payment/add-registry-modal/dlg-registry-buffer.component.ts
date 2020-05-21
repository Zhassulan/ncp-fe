import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RegistryDialogData} from '../payment.component';

@Component({
    selector: 'app-add-registry-modal',
    templateUrl: './dlg-registry-buffer.component.html',
    styleUrls: ['./dlg-registry-buffer.component.css']
})
export class DlgRegistryBufferComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<DlgRegistryBufferComponent>,
        @Inject(MAT_DIALOG_DATA) public data: RegistryDialogData) {
    }

    ngOnInit(): void {
    }

}
