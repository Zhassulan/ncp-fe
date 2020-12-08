import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {TemplateDetail} from '../model/template-detail';

export interface DialogData {
  detail: TemplateDetail;
}

@Component({
  selector: 'app-dlg-template-detail',
  templateUrl: './dlg-template-detail.component.html',
  styleUrls: ['./dlg-template-detail.component.scss']
})
export class DlgTemplateDetailComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DlgTemplateDetailComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onCancel() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
