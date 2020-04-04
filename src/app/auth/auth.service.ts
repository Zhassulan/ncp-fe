import {Injectable} from '@angular/core';
import {locStorItems} from '../settings';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    constructor(private cookieService: CookieService) {
    }

    setUser(user) {
        localStorage.setItem(locStorItems.user, user)
    }

    logout() {
        this.cookieService.deleteAll();
        localStorage.removeItem(locStorItems.token)
        localStorage.removeItem(locStorItems.user)
    }

    getUser() {
        return localStorage.getItem(locStorItems.user)
    }

    isLogged(): boolean {
        return this.cookieService.get("JSESSIONID") == localStorage.getItem(locStorItems.token)
    }

}

export const AUTH_PROVIDERS: Array<any> = [{
    provide: AuthService, useClass: AuthService
}
]
