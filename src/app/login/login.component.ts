import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent  {

    message: string;

    constructor(public authService: AuthService, private router: Router) {
        this.message = '';
    }

    login(username: string, password: string): boolean {
        this.authService.login(username, password);
        /*
        if (!this.authService.login(username, password)) {
            this.message = 'Не верные данные входа..';
            setTimeout(function() {
            }.bind(this), 2500);
        }   else {
            this.router.navigate(['/home']);
        }
        */
        return false;
    }

    logout(): boolean {
        this.authService.logout();
        return false;
    }

}
