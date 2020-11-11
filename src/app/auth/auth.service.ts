import {Injectable} from '@angular/core';
import {locStorItems} from '../settings';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({ providedIn: 'root', })
export class AuthService {

    constructor(private http: HttpClient) {  }

    setUser(user) { localStorage.setItem(locStorItems.user, user); }

    logout() { localStorage.removeItem(locStorItems.user); }

    getUser() { return localStorage.getItem(locStorItems.user); }

    login(username, password) {
        const body = new HttpParams()
            .set('username', username)
            .set('password', password);
        return this.http.post(environment.apiUrl + '/auth/login', body.toString(), {
            headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})});
    }

}

export const AUTH_PROVIDERS: Array<any> = [{
    provide: AuthService, useClass: AuthService
}
]
