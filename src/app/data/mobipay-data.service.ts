import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Client} from '../clients/list/client';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HandleErr} from './handle-err';
import {catchError} from 'rxjs/operators';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class MobipayDataService {

    constructor(private http: HttpClient) {
    }

    clients() {
        return this.http.get<Client []>(`${API_URL}/mobipay/clients`).pipe(catchError(HandleErr.handleError));
    }

    partners(paymentId) {
        const params = new HttpParams()
            .set('paymentId', paymentId);
        return this.http.get<Client []>(`${API_URL}/mobipay/partners`, {params}).pipe(catchError(HandleErr.handleError));
    }

    change(id, isMobipay) {
        const params = new HttpParams()
            .set('paymentId', id)
            .set('isMobipay', isMobipay);
        return this.http.post<Client []>(`${API_URL}/mobipay/change`, {params}).pipe(catchError(HandleErr.handleError));
    }

}
