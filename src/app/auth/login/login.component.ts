import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {MatDialogRef, MatSnackBar} from '@angular/material';
import {User} from '../../model/user';
import {ldapGroups, timeouts, rests, msgs, localStorageTokenName} from '../../settings';
import {NGXLogger} from 'ngx-logger';

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
                public snackBar: MatSnackBar,
                private dialogRef:MatDialogRef<LoginComponent>,
                private logger: NGXLogger) {
    }

    login() {
        let userObj = new User (this.userName, this.userPassword, ldapGroups.tele2users);
        //проверка логина и пароля
        this.authService.login(userObj).subscribe(data => {
                if (data.result == rests.restResultOk) {
                    //проверка нахождения в группе
                    this.authService.isAuthorized(userObj).subscribe(data => {
                            if (data.result == rests.restResultOk) {
                                localStorage.setItem(localStorageTokenName, data.data.userName);
                                this.router.navigate(['/home']);
                                this.dialogRef.close();
                            }
                            if (data.result == rests.restResultErr) {
                                this.showMsg(msgs.msgNoRights);
                                this.logger.warn(msgs.msgNoRights + ' ' + userObj.userName);
                            }
                        },
                        error2 => {
                            this.showMsg(msgs.msgSysErrRights + ' ' + error2);
                            this.logger.error(msgs.msgSysErrRights + ' ' + userObj.userName);
                        });
                }
                if (data.result == rests.restResultErr) {
                    this.showMsg(msgs.msgWrongCreds);
                    this.logger.warn(msgs.msgWrongCreds + ' ' + userObj.userName);
                }
            },
            error2 => {
                this.showMsg(msgs.msgSysErrCreds + ' ' + error2);
                this.logger.error(msgs.msgSysErrCreds + ' ' + userObj.userName);
            });
    }

    showMsg(text) {
        this.openSnackBar(text, '');
        setTimeout(function () {
        }.bind(this), timeouts.timeoutAfterLoginInput);
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: timeouts.showMsgDelay,
        });
    }

}
