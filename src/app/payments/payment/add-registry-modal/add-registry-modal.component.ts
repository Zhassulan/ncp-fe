import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../dialog/dialog-data';

@Component({
    selector: 'app-add-registry-modal',
    templateUrl: './add-registry-modal.component.html',
    styleUrls: ['./add-registry-modal.component.css']
})
export class AddRegistryModalComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<AddRegistryModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit(): void {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
