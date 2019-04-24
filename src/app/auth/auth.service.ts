import {Injectable} from '@angular/core';
import {locStorItems} from '../settings';

@Injectable()
export class AuthService {

    constructor() {
    }

    logout() {
        localStorage.removeItem(locStorItems.userName);
    }

    getUser(): any {
        return localStorage.getItem(locStorItems.userName);
    }

    isLogged(): boolean {
        return this.getUser() !== null;
    }

}

export const AUTH_PROVIDERS: Array<any> = [{
    provide: AuthService, useClass: AuthService
}
];
