import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material';
import {DialogReportComponent} from './dialog-report/dialog-report.component';
import {DialogData} from './dialog-data';

@Injectable()
export class DialogService {

    title: string = null;
    dialogData: DialogData[] = [];
    dialogRef;

    constructor(public dialog: MatDialog) { }

    openDialog(): void {
        this.dialogRef = this.dialog.open(DialogReportComponent, {
            width: '50%',
            data: {
                title: this.title,
                items: this.dialogData
            }
        });
        /*
        dialogRef.afterClosed().subscribe(result => {
            //console.log('The dialog was closed');
            //this.animal = result;
        });
        */
    }

    setTitle(title) {
        this.title = title;
    }

    addItem(item, msg) {
        this.dialogData.push(new DialogData(item, msg));
    }

    clear() {
        this.title = null;
        this.dialogData = [];
    }

    setWait()    {
        this.dialogRef.componentInstance.isWait = true;
    }

    setWaitNot()  {
        this.dialogRef.componentInstance.isWait = false;
    }

}
