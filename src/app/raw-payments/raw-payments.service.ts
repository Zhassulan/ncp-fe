import {Injectable} from '@angular/core';
import {DateRangeMills} from '../payments/model/date-range-mills';
import {PaginationParams} from '../payments/model/pagination-params';
import {Observable} from 'rxjs';
import {PageableApiResponse} from '../payments/model/pageable-api-response';
import {HttpClient, HttpParams} from '@angular/common/http';
import {httpHeaders} from '../settings';
import {catchError} from 'rxjs/operators';
import {HttpErrHandler} from '../http-err-handler';
import {environment} from '../../environments/environment';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class RawPaymentsService {

  constructor(private http: HttpClient) {
  }

  raw(dateRange: DateRangeMills, paginationParam: PaginationParams): Observable<PageableApiResponse> {
    let httpParams;
    if (dateRange) {
      httpParams = new HttpParams()
        .set('after', dateRange.after)
        .set('before', dateRange.before)
        .set('page', paginationParam.page)
        .set('page-size', paginationParam.pageSize)
        .set('sort-col', paginationParam.sortColumn)
        .set('sort-order', paginationParam.sortOrder);
    }
    return this.http.get<PageableApiResponse>(`${API_URL}/v1/raw-payments`, {
      params: httpParams,
      headers: httpHeaders
    }).pipe(catchError(HttpErrHandler.handleError));
  }

  minDate(): Observable<number> {
    return this.http.get<number>(`${API_URL}/v1/raw-payments/min-date`, {headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  maxDate(): Observable<number> {
    return this.http.get<number>(`${API_URL}/v1/raw-payments/max-date`, {headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }
}
