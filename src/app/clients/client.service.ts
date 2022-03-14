import {Injectable} from '@angular/core';
import {Client} from './list/client';
import {Observable, Subject} from 'rxjs';
import {ClientRepository} from './client-repository';
import {NotificationsService} from 'angular2-notifications';
import {Payment} from '../payment/model/payment';
import {ClientProfile} from './clientProfile';
import {map} from 'rxjs/operators';
import {ProgressBarService} from '../progress-bar.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  clntPayments;
  clntPaymentsObs = new Subject<Payment []>();
  clntPayAnnounced$ = this.clntPaymentsObs.asObservable();
  private _clientProfile: ClientProfile;
  private _client: Client;

  constructor(private clntDataService: ClientRepository,
              private notifService: NotificationsService,
              private clntRepo: ClientRepository,
              private progressBarService: ProgressBarService) {
  }

  get client() {
    return this._client;
  }

  set client(value) {
    this._client = value;
  }

  announceClntPayments() {
    this.clntPaymentsObs.next(this.clntPayments);
  }

  payments(id, start?, end?) {
    this.progressBarService.start();
    if (start && end) {
      this.clntDataService.paymentsRange(id, start, end).subscribe(
        data => {
          this.clntPayments = data;
          this.announceClntPayments();
        },
        error => {
          this.progressBarService.stop();
          this.notifService.error(error.message);
          this.progressBarService.stop();
        },
        () => this.progressBarService.stop()
      );
    } else {
      this.clntDataService.payments(id).subscribe(
        data => {
          this.clntPayments = data;
          this.announceClntPayments();
        },
        error => {
          this.progressBarService.stop();
          this.notifService.error(error.message);
        },
        () => this.progressBarService.stop()
      );
    }
  }

  findClientProfile(id): Observable<ClientProfile> {
    return this.clntRepo.profile(id).pipe(map(x => this.clientProfile = x));
  }

  loadProfile(id) {
    return this.clntRepo.profile(id);
  }

  set clientProfile(x) {
    this._clientProfile = x;
  }

  get clientProfile() {
    return this._clientProfile;
  }

}
