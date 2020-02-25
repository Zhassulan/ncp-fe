import {Injectable} from '@angular/core';
import {locStorItems} from '../settings';
import {SessionService} from './session.service';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    constructor(private cookieService: CookieService) {
    }

    logout() {
        console.log('Logging out..');
        this.cookieService.deleteAll();
        localStorage.removeItem(locStorItems.userName);
    }

    getUser(): any {
        return localStorage.getItem(locStorItems.userName);
    }

    isLogged(): boolean {
        return localStorage.getItem("username") !== null;
    }

}

export const AUTH_PROVIDERS: Array<any> = [{
    provide: AuthService, useClass: AuthService
}
];
