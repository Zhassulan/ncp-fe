import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {MatDialogRef, MatSnackBar} from '@angular/material';
import {LoginObject} from '../../model/login-object';
import {User} from '../../model/user';
import {settings} from 'cluster';
import {ldapGroups} from '../../settings';

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

    constructor(public authService: AuthService, private router: Router, public snackBar: MatSnackBar, private dialogRef:MatDialogRef<LoginComponent>) {
    }

    login() {
        let userObj = new User (this.userName, this.userPassword, ldapGroups.tele2users);
        //проверка логина и пароля
        this.authService.login(userObj).subscribe(data => {
                if (data.result == 'ok') {
                    //проверка нахождения в группе
                    this.authService.isAuthorized(userObj).subscribe(data => {
                            if (data.result == 'ok') {
                                localStorage.setItem('username', data.data.userName);
                                this.router.navigate(['/home']);
                                this.dialogRef.close();
                            }
                            if (data.result == 'error') {
                                this.showError('Извините, у Вас нет разрешений на использование приложения.');
                            }
                        },
                        error2 => {
                            this.showError('Системная ошибка проверки разрешений.');
                        });
                }
                if (data.result == 'error') {
                    this.showError('Не верный пользователь или пароль.');
                }
            },
            error2 => {
                this.showError('Системная ошибка проверки логина и пароля.');
            });
    }

    showError(text) {
        this.openSnackBar(text, '');
        setTimeout(function () {
        }.bind(this), 3000);
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 3000,
        });
    }

}
