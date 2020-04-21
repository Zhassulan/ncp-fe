import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CalendarDialogData} from '../payment.component';

@Component({
  selector: 'app-calendar-defer-modal',
  templateUrl: './calendar-defer-modal.component.html',
  styleUrls: ['./calendar-defer-modal.component.css']
})
export class CalendarDeferModalComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<CalendarDeferModalComponent>,
               @Inject(MAT_DIALOG_DATA) public data: CalendarDialogData) { }

  ngOnInit(): void {
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

}
