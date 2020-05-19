import {environment} from '../../environments/environment';
import {Payment} from '../payment/model/payment';
import {httpOptions, MSG} from '../settings';
import {RouterRegistry} from '../router/model/router-registry';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import * as HttpStatus from 'http-status-codes';
import {HandleErr} from './handle-err';

const API_URL = environment.apiUrl;

@Injectable({
    providedIn: 'root'
})
export class PayDataService {

    constructor(private http: HttpClient) {
    }

    handleError(error: HttpErrorResponse) {
        if (error.status == HttpStatus.NOT_FOUND ||
            error.status == HttpStatus.SERVICE_UNAVAILABLE) return throwError(MSG.errService);
        return throwError(error);
    }

    all(start, end) {
        const params = new HttpParams()
            .set('start', start)
            .set('end', end);
        return this.http.get<Payment []>(`${API_URL}/payments`, {params}).pipe(catchError(HandleErr.handleError));
    }

    public json() {
        return this.http.get<Payment []>('./assets/payments.json').pipe(catchError(HandleErr.handleError));
    }

    transit(id) {
        return this.http.post<Payment>(`${API_URL}/payments/${id}/transit`, httpOptions).pipe(catchError(HandleErr.handleError));
    }

    transitDel(id) {
        return this.http.delete<Payment>(API_URL + `/payments/${id}/transit`).pipe(catchError(HandleErr.handleError));
    }

    routerRegistry(formData: FormData) {
        return this.http.post<RouterRegistry>(`${API_URL}/payments/router/registry`, formData).pipe(catchError(HandleErr.handleError));
    }

    distribute(id, details) {
        return this.http.post(`${API_URL}/payments/${id}/distribution`, details, httpOptions).pipe(catchError(HandleErr.handleError));
    }

    findById(id: number) {
        return this.http.get<Payment>(`${API_URL}/payments/${id}/`, httpOptions).pipe(catchError(HandleErr.handleError));
    }

    validateAccount(profileId, account) {
        return this.http.get(`${API_URL}/profile/${profileId}/account/${account}`, httpOptions).pipe(catchError(HandleErr.handleError));
    }

    validateMsisdn(profileId, msisdn) {
        return this.http.get(`${API_URL}/profile/${profileId}/msisdn/${msisdn}`, httpOptions).pipe(catchError(HandleErr.handleError));
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
        return this.http.post(`${API_URL}/payments/${payment.id}/defer`, payment.details, httpOptions).pipe(catchError(HandleErr.handleError));
    }

    del(id) {
        return this.http.delete<Payment>(API_URL + `/payments/${id}`).pipe(catchError(HandleErr.handleError));
    }



}
