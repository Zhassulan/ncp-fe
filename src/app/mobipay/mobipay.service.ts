import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {LimitsUpdateResponse} from './model/limits-update-response';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {HttpErrHandler} from '../http-err-handler';
import {environment} from '../../environments/environment';
import {Client} from '../clients/list/client';
import {httpHeaders} from '../settings';
import {Payment} from '../payment/model/payment';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class MobipayService {

  limits: LimitsUpdateResponse [];

  constructor(private http: HttpClient,
              private notifService: NotificationsService) {
  }

  updateLimits(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return new Observable(
      observer => {
        this.http.post<LimitsUpdateResponse []>(`${API_URL}/v1/mobipay/limits`, formData).pipe(catchError(HttpErrHandler.handleError))
          .subscribe(
            data => {
              this.limits = data;
              observer.next(true);
            },
            error => {
              this.notifService.error(error.message);
              observer.error(false);
            },
            () => {
              observer.complete();
            });
      }
    );
  }

  resetFile() {
    this.limits = null;
  }

  clients() {
    return this.http.get<Client []>(`${API_URL}/v1/mobipay/clients`).pipe(catchError(HttpErrHandler.handleError));
  }

  partners(paymentId) {
    const params = new HttpParams()
      .set('paymentId', paymentId);
    return this.http.get<Client []>(`${API_URL}/v1/mobipay/partners`, {params}).pipe(catchError(HttpErrHandler.handleError));
  }

  change(id) {
    return this.http.post<number>(`${API_URL}/v1/mobipay/change/${id}`, {headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  distribute(id, cancel, partnerCode) {
    const params = new HttpParams()
      .set('cancel', cancel)
      .set('partnerCode', partnerCode);
    return this.http.post<Payment>(`${API_URL}/v1/mobipay/distribute/${id}`, null, {params})
      .pipe(catchError(HttpErrHandler.handleError));
  }
}
