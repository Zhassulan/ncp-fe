import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RestResponse} from './rest-response';
import {httpOptions} from '../settings';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class RegistryDataService {

    constructor(private http: HttpClient) {
    }

    all(): Observable<RestResponse> {
        return this.http.post<RestResponse>(`${API_URL}/registries`, httpOptions);
    }

    findById(id): Observable<RestResponse> {
        return this.http.post<RestResponse>(`${API_URL}/registries/${id}`, httpOptions);
    }

    range(start, end, bin): Observable<any> {
        const params = new HttpParams()
            .set('start', start)
            .set('end', end)
            .set('bin', bin);
        return this.http.get<RestResponse>(`${API_URL}/registries/range`, {params});
    }

}
