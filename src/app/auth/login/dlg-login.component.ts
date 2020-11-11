import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialogRef} from '@angular/material/dialog';
import {NotificationsService} from 'angular2-notifications';
import * as HttpStatus from 'http-status-codes';
import {Subscription} from 'rxjs';
import {Message} from '../../message';

@Component({
    selector: 'app-login',
    templateUrl: './dlg-login.component.html',
    styleUrls: ['./dlg-login.component.scss']
})

export class DlgLoginComponent implements OnInit {

    userName: string;
    userPassword: string;
    isWait: boolean = true;
    returnUrl: string;
    keyVal: string = '';
    private subscription: Subscription;

    constructor(public authService: AuthService,
                private route: ActivatedRoute,
                private router: Router,
                private dialogRef: MatDialogRef<DlgLoginComponent>,
                private notifService: NotificationsService) {
    }

    ngOnInit(): void {
        this.isWait = false;
        this.authService.logout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    onEnter(value: string) {
        this.keyVal = value;
        this.login();
    }

    login() {
        if (!(this.userName && this.userPassword))  {
            this.notifService.warn(Message.WAR.ENTER_LOGIN_PASSWORD);
            return;
        }
        this.subscription = this.authService.login(this.userName, this.userPassword).subscribe(
            data => {
                this.authService.setUser(this.userName);
                this.returnUrl == '/' ? this.router.navigate(['payments']) : this.router.navigateByUrl(this.returnUrl);
                this.dialogRef.close();
            },
            error => error.status === HttpStatus.SERVICE_UNAVAILABLE ? this.notifService.error(error.message) : this.notifService.error(Message.ERR.ACCESS_DENIED));
    }

}
