import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {LoginComponent} from '../login/login.component';


@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, AfterViewInit {

    ngAfterViewInit(): void {
        setTimeout(() => {
            const dialogRef = this.dialog.open(LoginComponent, {
                width: '20%',
                height: '30%'
            });
        });
    }

    constructor(public dialog: MatDialog) {
    }

    ngOnInit() {

    }

}
