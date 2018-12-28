import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {httpOptions} from '../settings';
import {RestResponse} from '../data/rest-response';
import {Observable} from 'rxjs';
import {User} from '../model/user';

@Injectable({
    providedIn: 'root',
})
export class AuthService {

    constructor(private http: HttpClient) {
    }

    login(userObj: User): Observable <RestResponse> {
        return this.http.post <RestResponse>(environment.urlValidateLogin, userObj, httpOptions);
    }

    isAuthorized(userObj: User): Observable <RestResponse>  {
        return this.http.post <RestResponse>(environment.urlValidateAuthorization, userObj, httpOptions);
    }

    logout() {
        localStorage.removeItem('username');
    }

    getUser(): any {
        return localStorage.getItem('username');
    }

    isLogged(): boolean {
        return this.getUser() !== null;
    }

}

export const AUTH_PROVIDERS: Array<any> = [{
    provide: AuthService, useClass: AuthService
}
];
