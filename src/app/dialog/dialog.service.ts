import {Injectable} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {DialogReportComponent} from './dialog-report/dialog-report.component';
import {DialogData} from './dialog-data';

@Injectable({
    providedIn: 'root',
})
export class DialogService {

    title: string = null;
    dialogData: DialogData[] = [];
    dialogRef;

    constructor(public dialog: MatDialog) { }

    openDialog(): void {
        this.dialogRef = this.dialog.open(DialogReportComponent, {
            width: '60%',
            data: {
                title: this.title,
                items: this.dialogData
            }
        });
    }

    setTitle(title) {
        this.title = title;
    }

    addItem(msg) {
        this.dialogData.push(new DialogData(msg));
    }

    clear() {
        this.title = null;
        this.dialogData = [];
    }

}
