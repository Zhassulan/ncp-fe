import {AfterViewInit, Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {DlgLoginComponent} from '../login/dlg-login.component';


@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, AfterViewInit {

    ngAfterViewInit(): void {
        setTimeout(() => {
            const dialogRef = this.dialog.open(DlgLoginComponent, {disableClose: true});
        }, 0);
    }

    constructor(public dialog: MatDialog) {
    }

    ngOnInit() {

    }

}
