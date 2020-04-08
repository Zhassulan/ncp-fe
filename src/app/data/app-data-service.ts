import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {User} from '../auth/model/user';
import {Observable} from 'rxjs';
import {RestResponse} from './rest-response';
import {httpOptions} from '../settings';
import {Version} from '../version';
import {Injectable} from '@angular/core';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class AppDataService {

    constructor(private http: HttpClient) { }

    login(username, password) {
        const body = new HttpParams()
            .set('username', username)
            .set('password', password);
        return this.http.post(API_URL + '/auth/login', body.toString(), {
            headers: new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded'})});
    }

    authorize(userObj: User) {
        return this.http.post(`${API_URL}/auth/authorization`, userObj, httpOptions);
    }

    ver() {
        return this.http.get<Version>(`${API_URL}/ver`, httpOptions);
    }

}