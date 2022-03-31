import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PaymentDto} from '../payment/dto/paymentDto';
import {httpHeaders} from '../settings';
import {catchError} from 'rxjs/operators';
import {HttpErrHandler} from '../http-err-handler';
import {GetPaymentsPaginationParams} from './model/get-payments-pagination-params';
import {Observable} from 'rxjs';
import {DateRangeMills} from './model/date-range-mills';
import {PaymentsApiResponsePage} from './model/payments-api-response-page';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private http: HttpClient) {
  }

  getPaymentById(id: number) {
    return this.http.get<PaymentDto>(`${API_URL}/v2/payments/${id}`, {headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  getPayments(dateRange: DateRangeMills,
              profileId: number,
              paginationParam: GetPaymentsPaginationParams): Observable<PaymentsApiResponsePage> {

    let httpParams;
    if (dateRange && !profileId) {
      httpParams = new HttpParams()
        .set('after', dateRange.after)
        .set('before', dateRange.before)
        .set('page', paginationParam.page)
        .set('page-size', paginationParam.pageSize)
        .set('sort-col', paginationParam.sortColumn)
        .set('sort-order', paginationParam.sortOrder);
    }
    if (!dateRange && profileId) {
      httpParams = new HttpParams()
        .set('profile-id', profileId)
        .set('page', paginationParam.page)
        .set('page-size', paginationParam.pageSize)
        .set('sort-col', paginationParam.sortColumn)
        .set('sort-order', paginationParam.sortOrder);
    }
    if (dateRange && profileId) {
      httpParams = new HttpParams()
        .set('profile-id', profileId)
        .set('after', dateRange.after)
        .set('before', dateRange.before)
        .set('page', paginationParam.page)
        .set('page-size', paginationParam.pageSize)
        .set('sort-col', paginationParam.sortColumn)
        .set('sort-order', paginationParam.sortOrder);
    }

    return this.http.get<PaymentsApiResponsePage>(`${API_URL}/v2/payments`, {params: httpParams, headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  minDateByProfile(profileId: number): Observable<number> {
    const httpParams = new HttpParams().set('profile-id', profileId);
    return this.http.get<number>(`${API_URL}/v2/payments/min-date`, {params: httpParams, headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  maxDateByProfile(profileId: number): Observable<number> {
    const httpParams = new HttpParams().set('profile-id', profileId);
    return this.http.get<number>(`${API_URL}/v2/payments/max-date`, {params: httpParams, headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }
}
