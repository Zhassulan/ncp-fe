import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {httpHeaders} from '../settings';
import {catchError} from 'rxjs/operators';
import {HttpErrHandler} from '../http-err-handler';
import {environment} from '../../environments/environment';
import {PaymentDto} from './dto/paymentDto';

const API_URL = environment.API_URL + '/v2';

@Injectable({providedIn: 'root'})
export class PaymentV2Service {

  constructor(private http: HttpClient) {
  }

  getPaymentById(id: number) {
    return this.http.get<PaymentDto>(`${API_URL}/payments/${id}`, {headers: httpHeaders}).pipe(catchError(HttpErrHandler.handleError));
  }
}
