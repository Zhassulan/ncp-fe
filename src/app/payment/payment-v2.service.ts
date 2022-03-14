import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {headers} from '../settings';
import {catchError} from 'rxjs/operators';
import {HttpErrHandler} from '../http-err-handler';
import {environment} from '../../environments/environment';
import {PaymentDto} from './dto/paymentDto';

const API_URL = environment.apiUrl + '/v2';

@Injectable({providedIn: 'root'})
export class PaymentV2Service {

  constructor(private http: HttpClient) {
  }

  getPaymentById(id: number) {
    return this.http.get<PaymentDto>(`${API_URL}/payments/${id}`, {headers: headers}).pipe(catchError(HttpErrHandler.handleError));
  }
}
