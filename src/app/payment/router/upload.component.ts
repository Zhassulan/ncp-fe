import {Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {DlgImportRouterRegistryComponent} from '../dialog/dlg-import-router-registry.component';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

    dialogRef;

    constructor(public dialog: MatDialog) {
    }

    public openUploadDialog() {
        this.dialogRef = this.dialog.open(DlgImportRouterRegistryComponent, {disableClose: true});
    }

}
