import {environment} from '../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {User} from './auth/model/user';
import {httpOptions} from './settings';
import {Version} from './version';
import {Injectable} from '@angular/core';
import {catchError} from 'rxjs/operators';
import {HttpErrHandler} from './http-err-handler';

const API_URL = environment.API_URL + '/v1';

@Injectable({
    providedIn: 'root'
})
export class AppDataService {

    constructor(private http: HttpClient) { }

    ver() {
        return this.http.get<Version>(`${API_URL}/ver`, httpOptions).pipe(catchError(HttpErrHandler.handleError));
    }

}
