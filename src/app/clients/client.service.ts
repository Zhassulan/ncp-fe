import {Injectable} from '@angular/core';
import {Client} from './list/client';
import {Observable, Subject} from 'rxjs';
import {NotificationsService} from 'angular2-notifications';
import {Payment} from '../payment/model/payment';
import {ClientProfile} from './clientProfile';
import {catchError} from 'rxjs/operators';
import {ProgressBarService} from '../progress-bar.service';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {httpHeaders} from '../settings';
import {HttpErrHandler} from '../http-err-handler';

const API_URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private _clntPayments;
  private clntPaymentsObs = new Subject<Payment []>();
  private _clientPayAnnounced$ = this.clntPaymentsObs.asObservable();
  private _clientProfile: ClientProfile;
  private _client: Client;

  constructor(private notifService: NotificationsService,
              private progressBarService: ProgressBarService,
              private http: HttpClient) {
  }

  set clntPayments(value) {
    this._clntPayments = value;
    this.announceClientPayments();
  }

  get clientPayAnnounced$(): Observable<any> {
    return this._clientPayAnnounced$;
  }

  get client() {
    return this._client;
  }

  set client(value) {
    this._client = value;
  }

  announceClientPayments() {
    this.clntPaymentsObs.next(this._clntPayments);
  }

  getPayments(id, start?, end?) {
    if (start && end) {
      return this.getPaymentsByDateRange(id, start, end);
    }
    return this.getPaymentsById(id);
  }

  getProfileById(id) {
    return this.http.get<ClientProfile>(`${API_URL}/v1/clients/profile/${id}`).pipe(catchError(HttpErrHandler.handleError));
  }

  set clientProfile(x) {
    this._clientProfile = x;
  }

  get clientProfile() {
    return this._clientProfile;
  }

  props(bin, profileId) {
    const params = new HttpParams()
      .set('profileId', profileId);
    return this.http.get<number>(`${API_URL}/v1/clients/${bin}/props`, {params: params, headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  all() {
    return this.http.get<Client []>(`${API_URL}/v1/profiles`, {headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  private getPaymentsById(id) {
    return this.http.get<Payment []>(`${API_URL}/v1/clients/${id}/payments`, {headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  private getPaymentsByDateRange(id, start, end) {
    const params = new HttpParams()
      .set('start', start)
      .set('end', end);
    return this.http.get<Payment []>(`${API_URL}/v1/clients/${id}/payments/range`, {params: params, headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  phones(bin, value, limit) {
    const params = new HttpParams()
      .set('limit', limit);
    return this.http.get<string []>(`${API_URL}/v1/clients/${bin}/phones/${value}`, {params: params, headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }

  accounts(bin, value, limit) {
    const params = new HttpParams()
      .set('limit', limit);
    return this.http.get<string []>(`${API_URL}/v1/clients/${bin}/accounts/${value}`, {params: params, headers: httpHeaders})
      .pipe(catchError(HttpErrHandler.handleError));
  }
}
