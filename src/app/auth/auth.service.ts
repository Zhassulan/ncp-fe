import {Injectable} from '@angular/core';
import {locStorItems} from '../settings';
import {SessionService} from './session.service';

@Injectable()
export class AuthService {

    constructor(private session: SessionService) {
    }

    /*
    logout() {
        localStorage.removeItem(locStorItems.userName);
    }

    getUser(): any {
        return localStorage.getItem(locStorItems.userName);
    }

    isLogged(): boolean {
        return this.getUser() !== null;
    }
    */

    //----

    getUser(): any {
        return this.session.name;
    }

    public isLogged() {
        return !!this.session.accessToken;
    }

    public logout() {
        this.session.destroy();
    }

    public doSignIn(accessToken: string, name: string) {
        if ((!accessToken) || (!name)) {
            return;
        }
        this.session.accessToken = accessToken;
        this.session.name = name;
    }

}

export const AUTH_PROVIDERS: Array<any> = [{
    provide: AuthService, useClass: AuthService
}
];
