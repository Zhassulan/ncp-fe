import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialogRef} from '@angular/material/dialog';
import {msgs} from '../../settings';
import {NotificationsService} from 'angular2-notifications';
import {AppDataService} from '../../data/app-data-service';
import * as HttpStatus from 'http-status-codes';
import {AppService} from '../../app.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {

    userName: string;
    userPassword: string;
    isWait: boolean = true;
    returnUrl: string;
    keyVal: string = '';
    private subscription: Subscription;

    constructor(public authService: AuthService,
                private route: ActivatedRoute,
                private router: Router,
                private dialogRef: MatDialogRef<LoginComponent>,
                private notifService: NotificationsService,
                private appService: AppService,
                private appDataService: AppDataService) {
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
            this.notifService.warn(msgs.msgDataNotProvided);
            return;
        }
        this.subscription = this.appDataService.login(this.userName, this.userPassword).subscribe(
            data => {
                this.authService.setUser(this.userName);
                this.appService.checkVer();
                this.returnUrl == '/' ? this.router.navigate(['payments']) : this.router.navigateByUrl(this.returnUrl);
                this.dialogRef.close();
            },
            error => {
                if (error.status === HttpStatus.SERVICE_UNAVAILABLE)
                    this.notifService.error(error.error.errm);
                   else
                    this.notifService.error('Ошибка доступа');

            });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
