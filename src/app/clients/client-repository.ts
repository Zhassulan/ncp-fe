import {environment} from '../../environments/environment';
import {Client} from './list/client';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Payment} from '../payment/model/payment';
import {catchError} from 'rxjs/operators';
import {ClientProfile} from './clientProfile';
import {HttpErrHandler} from '../http-err-handler';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class ClientRepository {

    constructor(private http: HttpClient) { }

    props(bin, profileId)   {
        const params = new HttpParams()
            .set('profileId', profileId);
        return this.http.get<number>(`${API_URL}/clients/${bin}/props`, {params}).pipe(catchError(HttpErrHandler.handleError));
    }

    all() {
        return this.http.get<Client []> (`${API_URL}/clients`).pipe(catchError(HttpErrHandler.handleError));
    }

    payments(id) {
        return this.http.get<Payment []> (`${API_URL}/clients/${id}/payments`).pipe(catchError(HttpErrHandler.handleError));
    }

    paymentsRange(id, start, end) {
        const params = new HttpParams()
            .set('start', start)
            .set('end', end);
        return this.http.get<Payment []> (`${API_URL}/clients/${id}/payments/range`, {params}).pipe(catchError(HttpErrHandler.handleError));
    }


    phones(bin, value, limit)   {
        const params = new HttpParams()
            .set('limit', limit);
        return this.http.get<string []>(`${API_URL}/clients/${bin}/phones/${value}`, {params}).pipe(catchError(HttpErrHandler.handleError));
    }

    accounts(bin, value, limit)   {
        const params = new HttpParams()
            .set('limit', limit);
        return this.http.get<string []>(`${API_URL}/clients/${bin}/accounts/${value}`, {params}).pipe(catchError(HttpErrHandler.handleError));
    }

    profile(profileId)   {
        console.log(`Loading profile ID ${profileId}..`);
        return this.http.get<ClientProfile>(`${API_URL}/clients/profile/${profileId}`).pipe(catchError(HttpErrHandler.handleError));
    }

}
