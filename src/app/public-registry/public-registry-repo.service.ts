import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {httpOptions} from '../settings';
import {catchError} from 'rxjs/operators';
import {HttpErrHandler} from '../http-err-handler';
import {RegistryReportItem} from './model/registry-report-item';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class PublicRegistryRepo {

    constructor(private http: HttpClient) {
    }

    all() {
        return this.http.get<RegistryReportItem []>(`${API_URL}/registries`, httpOptions).pipe(catchError(HttpErrHandler.handleError));
    }

    findById(id) {
        return this.http.get(`${API_URL}/registries/${id}`, httpOptions).pipe(catchError(HttpErrHandler.handleError));
    }

    range(start, end, bin) {
        let params;
        if (bin)
            params = new HttpParams()
                .set('start', start)
                .set('end', end)
                .set('bin', bin);
        else
            params = new HttpParams()
                .set('start', start)
                .set('end', end);
        return this.http.get<RegistryReportItem []>(`${API_URL}/registries/range`, {params}).pipe(catchError(HttpErrHandler.handleError));
    }

}
