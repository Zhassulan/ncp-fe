import {Injectable} from '@angular/core';
import {Client} from './list/client';
import {Subject} from 'rxjs';
import {ClientRepo} from './client-repo.service';
import {AppService} from '../app.service';
import {NotificationsService} from 'angular2-notifications';
import {Payment} from '../payment/model/payment';
import {Utils} from '../utils';

@Injectable({
    providedIn: 'root'
})
export class ClientService {

    clntPayments;
    clntPaymentsObs = new Subject<Payment []>();
    clntPayAnnounced$ = this.clntPaymentsObs.asObservable();

    constructor(private clntDataService: ClientRepo,
                private appService: AppService,
                private notifService: NotificationsService) {
    }

    private _client: Client;

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
                    this.appService.setProgress(false);
                },
                () => this.appService.setProgress(false)
            );
        }
    }

}
