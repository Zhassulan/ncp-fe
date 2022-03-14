import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Client} from '../clients/list/client';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Payment} from '../payment/model/payment';
import {LimitsUpdateResponse} from './model/limits-update-response';
import {HttpErrHandler} from '../http-err-handler';
import {headers, httpOptions} from '../settings';

const API_URL = environment.apiUrl + '/v1';

@Injectable({
  providedIn: 'root'
})
export class MobipayRepository {

  constructor(private http: HttpClient) {
  }

  clients() {
    return this.http.get<Client []>(`${API_URL}/mobipay/clients`).pipe(catchError(HttpErrHandler.handleError));
  }

  partners(paymentId) {
    const params = new HttpParams()
      .set('paymentId', paymentId);
    return this.http.get<Client []>(`${API_URL}/mobipay/partners`, {params}).pipe(catchError(HttpErrHandler.handleError));
  }

  change(id, isMobipay) {
    return this.http.post<number>(`${API_URL}/mobipay/change/${id}/${isMobipay}`, {headers: headers}).pipe(catchError(HttpErrHandler.handleError));
  }

  distribute(id, cancel, partnerCode) {
    const params = new HttpParams()
      .set('cancel', cancel)
      .set('partnerCode', partnerCode);
    return this.http.post<Payment>(`${API_URL}/mobipay/distribute/${id}`, null, {params}).pipe(catchError(HttpErrHandler.handleError));
  }

  updateLimits(formData: FormData) {
    return this.http.post<LimitsUpdateResponse []>(`${API_URL}/mobipay/limits`, formData).pipe(catchError(HttpErrHandler.handleError));
  }


}
