import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {headers} from '../settings';
import {catchError} from 'rxjs/operators';
import {HttpErrHandler} from '../http-err-handler';

const API_URL = environment.apiUrl + '/v1';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  isMobipay(id: number) {
    return this.http.get<boolean>(`${API_URL}/profile/${id}/is-mobipay`, { headers: headers }).pipe(catchError(HttpErrHandler.handleError));
  }

  isMobipayByPaymentId(id: number) {
    return this.http.get<boolean>(`${API_URL}/profile/payment/${id}/is-mobipay`, {
      headers: headers
    }).pipe(catchError(HttpErrHandler.handleError));
  }
}
