import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CalendarDialogData} from '../payment.component';

@Component({
  selector: 'app-calendar-defer-modal',
  templateUrl: './dlg-defer.component.html',
  styleUrls: ['./dlg-defer.component.css']
})
export class DlgDeferComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DlgDeferComponent>,
               @Inject(MAT_DIALOG_DATA) public data: CalendarDialogData) { }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}
