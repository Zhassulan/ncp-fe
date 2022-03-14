import {environment} from '../../environments/environment';
import {Payment} from './model/payment';
import {RouterRegistry} from '../router/model/router-registry';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import * as HttpStatus from 'http-status-codes';
import {HttpErrHandler} from '../http-err-handler';
import {Message} from '../message';
import {headers} from '../settings';

const API_URL = environment.apiUrl + '/v1';

@Injectable({
  providedIn: 'root'
})
export class PaymentRepository {

  constructor(private http: HttpClient) {
  }

  handleError(error: HttpErrorResponse) {
    if (error.status === HttpStatus.NOT_FOUND ||
      error.status === HttpStatus.SERVICE_UNAVAILABLE) {
      return throwError(Message.ERR.SERVICE);
    }
    return throwError(error);
  }

  range(start, end) {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
    return this.http.get<Payment []>(`${API_URL}/payments`, {
      params: params,
      headers: headers
    }).pipe(catchError(HttpErrHandler.handleError));
  }

  public json() {
    return this.http.get<Payment []>('./assets/payments.json', {headers: headers}).pipe(catchError(HttpErrHandler.handleError));
  }

  transit(id) {
    return this.http.post<Payment>(`${API_URL}/payments/${id}/transit`, {headers: headers}).pipe(catchError(HttpErrHandler.handleError));
  }

  transitDel(id) {
    return this.http.delete<Payment>(API_URL + `/payments/${id}/transit`, {headers: headers}).pipe(catchError(HttpErrHandler.handleError));
  }

  routerRegistry(formData: FormData) {
    return this.http.post<RouterRegistry>(`${API_URL}/payments/router/registry`, formData, {headers: headers})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  distribute(id, details) {
    return this.http.post(`${API_URL}/payments/${id}/distribution`, details, {headers: headers})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  findById(id: number) {
    return this.http.get<Payment>(`${API_URL}/payments/${id}/`, {headers: headers}).pipe(catchError(HttpErrHandler.handleError));
  }

  validateAccount(profileId, account) {
    return this.http.get(`${API_URL}/profile/${profileId}/account/${account}`, {headers: headers})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  validateMsisdn(profileId, msisdn) {
    return this.http.get(`${API_URL}/profile/${profileId}/msisdn/${msisdn}`, {headers: headers})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  defer(payment, deferDate) {
    const params = new HttpParams()
      .set('dt', deferDate);
    return this.http.post(`${API_URL}/payments/${payment.id}/defer`, payment.details, {params: params, headers: headers})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  del(id) {
    return this.http.delete<Payment>(API_URL + `/payments/${id}`, {headers: headers}).pipe(catchError(HttpErrHandler.handleError));
  }

  raw(start, end) {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
    return this.http.get<Payment []>(`${API_URL}/payments/raw`, {
      params: params,
      headers: headers
    }).pipe(catchError(HttpErrHandler.handleError));
  }
}
