import {Phone} from '../payment/model/phone';
import {environment} from '../../environments/environment';
import {Client} from '../clients/list/client';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Payment} from '../payment/model/payment';
import * as HttpStatus from 'http-status-codes';
import {throwError} from 'rxjs';
import {MSG} from '../settings';
import {catchError} from 'rxjs/operators';
import {HandleErr} from './handle-err';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class ClientDataService {

    constructor(private http: HttpClient) { }

    handleError(error: HttpErrorResponse){
        if (error.status == HttpStatus.NOT_FOUND ||
            error.status == HttpStatus.SERVICE_UNAVAILABLE) return throwError(MSG.serviceErr);
        return throwError(error);
    }

    props(bin, profileId)   {
        const params = new HttpParams()
            .set('profileId', profileId);
        return this.http.get<number>(`${API_URL}/clients/${bin}/props`, {params}).pipe(catchError(HandleErr.handleError));
    }

    all() {
        return this.http.get<Client []> (`${API_URL}/clients`).pipe(catchError(HandleErr.handleError));
    }

    payments(id) {
        return this.http.get<Payment []> (`${API_URL}/clients/${id}/payments`).pipe(catchError(HandleErr.handleError));
    }

    paymentsRange(id, start, end) {
        const params = new HttpParams()
            .set('start', start)
            .set('end', end);
        return this.http.get<Payment []> (`${API_URL}/clients/${id}/payments/range`, {params}).pipe(catchError(HandleErr.handleError));
    }


    phones(bin, value, limit)   {
        const params = new HttpParams()
            .set('limit', limit);
        return this.http.get<string []>(`${API_URL}/clients/${bin}/phones/${value}`, {params});
    }

    accounts(bin, value, limit)   {
        const params = new HttpParams()
            .set('limit', limit);
        return this.http.get<string []>(`${API_URL}/clients/${bin}/accounts/${value}`, {params});
    }

}
