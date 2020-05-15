import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {httpOptions} from '../settings';
import {RegistryReportItem} from '../registry/model/registry-report-item';
import {catchError} from 'rxjs/operators';
import {HandleErr} from './handle-err';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class RegistryDataService {

    constructor(private http: HttpClient) {
    }

    all() {
        return this.http.get<RegistryReportItem []>(`${API_URL}/registries`, httpOptions).pipe(catchError(HandleErr.handleError));
    }

    findById(id) {
        return this.http.get(`${API_URL}/registries/${id}`, httpOptions).pipe(catchError(HandleErr.handleError));
    }

    range(start, end, bin) {
        const params = new HttpParams()
            .set('start', start)
            .set('end', end)
            .set('bin', bin);
        return this.http.get<RegistryReportItem []>(`${API_URL}/registries/range`, {params}).pipe(catchError(HandleErr.handleError));
    }

}
