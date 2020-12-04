import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-enter-template-name',
  templateUrl: './dlg-enter-template-name.component.html',
  styleUrls: ['./dlg-enter-template-name.component.scss']
})
export class DlgEnterTemplateName {

  constructor(public dialogRef: MatDialogRef<DlgEnterTemplateName>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onCancel() {
    this.dialogRef.close();
  }

}
