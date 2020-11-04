import {environment} from '../../environments/environment';
import {Payment} from './model/payment';
import {httpOptions} from '../settings';
import {RouterRegistry} from '../router/model/router-registry';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import * as HttpStatus from 'http-status-codes';
import {HttpErrHandler} from '../http-err-handler';
import {Message} from '../message';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class PaymentRepository {

    constructor(private http: HttpClient) {
    }

    handleError(error: HttpErrorResponse) {
        if (error.status == HttpStatus.NOT_FOUND ||
            error.status == HttpStatus.SERVICE_UNAVAILABLE) return throwError(Message.ERR.SERVICE);
        return throwError(error);
    }

    range(start, end) {
        const params = new HttpParams()
            .set('start', start)
            .set('end', end);
        return this.http.get<Payment []>(`${API_URL}/payments`, {params}).pipe(catchError(HttpErrHandler.handleError));
    }

    public json() {
        return this.http.get<Payment []>('./assets/payments.json').pipe(catchError(HttpErrHandler.handleError));
    }

    transit(id) {
        return this.http.post<Payment>(`${API_URL}/payments/${id}/transit`, httpOptions).pipe(catchError(HttpErrHandler.handleError));
    }

    transitDel(id) {
        return this.http.delete<Payment>(API_URL + `/payments/${id}/transit`).pipe(catchError(HttpErrHandler.handleError));
    }

    routerRegistry(formData: FormData) {
        return this.http.post<RouterRegistry>(`${API_URL}/payments/router/registry`, formData).pipe(catchError(HttpErrHandler.handleError));
    }

    distribute(id, details) {
        return this.http.post(`${API_URL}/payments/${id}/distribution`, details, httpOptions).pipe(catchError(HttpErrHandler.handleError));
    }

    findById(id: number) {
        return this.http.get<Payment>(`${API_URL}/payments/${id}/`, httpOptions).pipe(catchError(HttpErrHandler.handleError));
    }

    validateAccount(profileId, account) {
        return this.http.get(`${API_URL}/profile/${profileId}/account/${account}`, httpOptions).pipe(catchError(HttpErrHandler.handleError));
    }

    validateMsisdn(profileId, msisdn) {
        return this.http.get(`${API_URL}/profile/${profileId}/msisdn/${msisdn}`, httpOptions).pipe(catchError(HttpErrHandler.handleError));
    }

    defer(payment, deferDate) {
        const params = new HttpParams()
            .set('dt', deferDate);
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            params: params
        };
        return this.http.post(`${API_URL}/payments/${payment.id}/defer`, payment.details, httpOptions).pipe(catchError(HttpErrHandler.handleError));
    }

    del(id) {
        return this.http.delete<Payment>(API_URL + `/payments/${id}`).pipe(catchError(HttpErrHandler.handleError));
    }

    raw(start, end) {
        const params = new HttpParams()
            .set('start', start)
            .set('end', end);
        return this.http.get<Payment []>(`${API_URL}/payments/raw`, {params}).pipe(catchError(HttpErrHandler.handleError));
    }

}
