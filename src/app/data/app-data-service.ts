import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {User} from '../auth/model/user';
import {Observable} from 'rxjs';
import {RestResponse} from './rest-response';
import {httpOptions} from '../settings';
import {Version} from '../version';

const API_URL = environment.apiUrl;

export class AppDataService {

    constructor(private http: HttpClient) { }

    login(username, password) {
        const body = new HttpParams()
            .set('username', username)
            .set('password', password);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        };
        return this.http.post(API_URL + '/auth/login', body.toString(), httpOptions);
    }

    authorize(userObj: User): Observable<RestResponse> {
        return this.http.post <RestResponse>(`${API_URL}/auth/authorization`, userObj, httpOptions);
    }

    version(): Observable<Version> {
        return this.http.get<Version>(`${API_URL}/ver`, httpOptions);
    }

}
