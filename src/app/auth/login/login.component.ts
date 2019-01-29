import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material';
import {User} from '../model/user';
import {ldapGroups, rests, msgs, locStorItems} from '../../settings';
import {NGXLogger} from 'ngx-logger';
import {NotificationsService} from 'angular2-notifications';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    userName: string;
    userPassword: string;
    isWait: boolean = true;

    ngOnInit(): void {
        this.isWait = false;
    }

    constructor(public authService: AuthService,
                private router: Router,
                private dialogRef:MatDialogRef<LoginComponent>,
                private logger: NGXLogger,
                private notifService: NotificationsService) {
    }

    login() {
        let userObj = new User (this.userName, this.userPassword, ldapGroups.tele2users);
        //проверка логина и пароля
        this.authService.login(userObj).subscribe(data => {
                if (data.result == rests.restResultOk) {
                    //проверка нахождения в группе
                    this.authService.isAuthorized(userObj).subscribe(data => {
                            if (data.result == rests.restResultOk) {
                                this.logger.info(msgs.msgLoggedSuccess + ' ' + userObj.userName);
                                localStorage.setItem(locStorItems.userName, data.data.userName);
                                this.router.navigate(['payments']);
                                this.dialogRef.close();
                            }
                            if (data.result == rests.restResultErr) {
                                this.notifService.warn(msgs.msgNoRights);
                                this.logger.warn(msgs.msgNoRights + ' ' + userObj.userName);
                            }
                        },
                        error2 => {
                            this.notifService.error(msgs.msgSysErrRights + ' ' + error2);
                            this.logger.error(msgs.msgSysErrRights + ' ' + userObj.userName + ' ' + error2);
                        });
                }
                if (data.result == rests.restResultErr) {
                    this.notifService.warn(msgs.msgWrongCreds);
                    this.logger.warn(msgs.msgWrongCreds + ' ' + userObj.userName);
                }
            },
            error2 => {
                this.notifService.error(msgs.msgSysErrCreds + ' ' + error2);
                this.logger.error(msgs.msgSysErrCreds + ' ' + userObj.userName + ' ' + error2);
            });
    }

}
