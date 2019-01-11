import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {httpOptions, locStorItems} from '../settings';
import {RestResponse} from '../data/rest-response';
import {Observable} from 'rxjs';
import {User} from '../model/user';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthService {

    constructor(private http: HttpClient) {
    }

    login(userObj: User): Observable <RestResponse> {
        return this.http.post <RestResponse>(environment.urlValidateLogin, userObj, httpOptions).catch(this.errorHandler);
    }

    isAuthorized(userObj: User): Observable <RestResponse>  {
        return this.http.post <RestResponse>(environment.urlValidateAuthorization, userObj, httpOptions).catch(this.errorHandler);
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

    errorHandler(error: HttpErrorResponse)  {
        return Observable.throwError(error.message || "Ошибка сервера.");
    }

}

export const AUTH_PROVIDERS: Array<any> = [{
    provide: AuthService, useClass: AuthService
}
];
