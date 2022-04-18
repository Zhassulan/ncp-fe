import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {httpHeaders} from '../../settings';
import {catchError} from 'rxjs/operators';
import {HttpErrHandler} from '../../http-err-handler';
import {GetPaymentsPaginationParams} from '../../payments/model/get-payments-pagination-params';
import {Observable} from 'rxjs';
import {ProfilesApiResponsePage} from '../model/profiles-api-response-page';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class ClientProfileService {

  constructor(private http: HttpClient) {
  }

  isMobipay(id: number) {
    return this.http.get<boolean>(`${API_URL}/v1/profile/${id}/is-mobipay`, {headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  isMobipayByPaymentId(id: number) {
    return this.http.get<boolean>(`${API_URL}/profile/v1/payment/${id}/is-mobipay`, {
      headers: httpHeaders
    }).pipe(catchError(HttpErrHandler.handleError));
  }

  getClientsProfile(clientIin: string,
                    clientName: string,
                    isMobipay: boolean,
                    paginationParam: GetPaymentsPaginationParams): Observable<ProfilesApiResponsePage> {

    let params;
    if (clientIin) {
      if (isMobipay) {
        params = new HttpParams()
          .set('client-iin', clientIin)
          .set('is-mobipay', isMobipay)
          .set('page', paginationParam.page)
          .set('page-size', paginationParam.pageSize)
          .set('sort-col', paginationParam.sortColumn)
          .set('sort-order', paginationParam.sortOrder);
      } else {
        params = new HttpParams()
          .set('client-iin', clientIin)
          .set('page', paginationParam.page)
          .set('page-size', paginationParam.pageSize)
          .set('sort-col', paginationParam.sortColumn)
          .set('sort-order', paginationParam.sortOrder);
      }
    } else if (clientName) {
      if (isMobipay) {
        params = new HttpParams()
          .set('client-name', clientName)
          .set('is-mobipay', isMobipay)
          .set('page', paginationParam.page)
          .set('page-size', paginationParam.pageSize)
          .set('sort-col', paginationParam.sortColumn)
          .set('sort-order', paginationParam.sortOrder);
      } else {
        params = new HttpParams()
          .set('client-name', clientName)
          .set('page', paginationParam.page)
          .set('page-size', paginationParam.pageSize)
          .set('sort-col', paginationParam.sortColumn)
          .set('sort-order', paginationParam.sortOrder);
      }
    } else {
      if (isMobipay) {
        params = new HttpParams()
          .set('is-mobipay', isMobipay)
          .set('page', paginationParam.page)
          .set('page-size', paginationParam.pageSize)
          .set('sort-col', paginationParam.sortColumn)
          .set('sort-order', paginationParam.sortOrder);
      } else {
        params = new HttpParams()
          .set('page', paginationParam.page)
          .set('page-size', paginationParam.pageSize)
          .set('sort-col', paginationParam.sortColumn)
          .set('sort-order', paginationParam.sortOrder);
      }
    }
    return this.http.get<ProfilesApiResponsePage>(`${API_URL}/v1/profiles`, {params: params, headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }
}
