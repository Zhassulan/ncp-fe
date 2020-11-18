import {Injectable} from '@angular/core';
import {Client} from './list/client';
import {observable, Observable, Subject} from 'rxjs';
import {ClientRepository} from './client-repository';
import {AppService} from '../app.service';
import {NotificationsService} from 'angular2-notifications';
import {Payment} from '../payment/model/payment';
import {Utils} from '../utils';
import {ClientProfile} from './clientProfile';
import {map} from 'rxjs/operators';

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
                private appService: AppService,
                private notifService: NotificationsService,
                private clntRepo: ClientRepository) {
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
        this.appService.setProgress(true);
        if (start && end) {
            this.clntDataService.paymentsRange(id, start, end).subscribe(
                data => {
                    this.clntPayments = data;
                    this.announceClntPayments(); },
                error => {
                    this.appService.setProgress(false);
                    this.notifService.error(error.message);
                    this.appService.setProgress(false);
                },
                () => this.appService.setProgress(false)
            );
        } else {
            this.clntDataService.payments(id).subscribe(
                data => {
                    this.clntPayments = data;
                    this.announceClntPayments(); },
                error => {
                    this.appService.setProgress(false);
                    this.notifService.error(error.message);
                },
                () => this.appService.setProgress(false)
            );
        }
    }

    findClientProfile(id): Observable<ClientProfile> {
        return this.clntRepo.profile(id).pipe(map(x => this.clientProfile = x));
    }

    loadProfile(id) {
        this.appService.setProgress(true);
        this.clntRepo.profile(id).subscribe(
            data => this.clientProfile = data,
            error => {
                this.appService.setProgress(false);
                this.notifService.error(error.message);
            }, () => this.appService.setProgress(false));
    }

    set clientProfile(x) {
        this._clientProfile = x;
    }

    get clientProfile() {
        return this._clientProfile;
    }

}
