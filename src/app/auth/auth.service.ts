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
        this.cookieService.deleteAll();
        sessionStorage.removeItem(locStorItems.userName);
    }

    getUser(): any {
        return sessionStorage.getItem(locStorItems.userName);
    }

    isLogged(): boolean {
        return sessionStorage.getItem("username") !== null;
    }

}

export const AUTH_PROVIDERS: Array<any> = [{
    provide: AuthService, useClass: AuthService
}
];
