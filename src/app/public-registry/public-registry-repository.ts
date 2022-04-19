import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {httpHeaders, httpOptions} from '../settings';
import {catchError} from 'rxjs/operators';
import {HttpErrHandler} from '../http-err-handler';
import {RegistryReportItem} from './model/registry-report-item';
import {DateRangeMills} from '../payments/model/date-range-mills';
import {Observable} from 'rxjs';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class PublicRegistryRepository {

  constructor(private http: HttpClient) {
  }

  all() {
    return this.http.get<RegistryReportItem []>(`${API_URL}/v1/registries`, httpOptions).pipe(catchError(HttpErrHandler.handleError));
  }

  findById(id) {
    return this.http.get(`${API_URL}/v1/registries/${id}`, httpOptions).pipe(catchError(HttpErrHandler.handleError));
  }

  range(dateRange: DateRangeMills, bin): Observable<RegistryReportItem []> {
    let params;
    if (bin) {
      params = new HttpParams()
        .set('start', dateRange.after)
        .set('end', dateRange.before)
        .set('bin', bin);
    } else {
      params = new HttpParams()
        .set('start', dateRange.after)
        .set('end', dateRange.before);
    }
    return this.http.get<RegistryReportItem []>(`${API_URL}/v1/registries/range`, {params: params, headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }
}
