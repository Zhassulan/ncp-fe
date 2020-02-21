import {Component, enableProdMode, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import {User} from '../model/user';
import {ldapGroups, rests, msgs, locStorItems} from '../../settings';
import {NGXLogger} from 'ngx-logger';
import {NotificationsService} from 'angular2-notifications';
import {environment} from '../../../environments/environment';
import {DataService} from '../../data/data.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    userName: string;
    userPassword: string;
    isWait: boolean = true;
    returnUrl: string;
    keyVal: string = '';

    constructor(public authService: AuthService,
                private route: ActivatedRoute,
                private router: Router,
                private dialogRef: MatDialogRef<LoginComponent>,
                private logger: NGXLogger,
                private notifService: NotificationsService,
                private dataService: DataService) {
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
        this.dataService.login(this.userName, this.userPassword).subscribe(
            data => {
                localStorage.setItem(locStorItems.userName, this.userName);
                this.logger.info(msgs.msgLoggedSuccess + ' ' + this.userName);
                if (this.returnUrl == '/') {
                    this.router.navigate(['main']);
                } else {
                    this.router.navigateByUrl(this.returnUrl);
                }
                this.dialogRef.close();
            },
            error2 => {
                this.notifService.error(msgs.msgErrLogin, error2);
                this.logger.error(msgs.msgErrLogin + ' ' + this.userName + ' ' + error2);
            });
    }

}
