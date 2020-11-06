import {Injectable, isDevMode} from '@angular/core';
import {Subject} from 'rxjs';
import {locStorItems} from './settings';
import {NotificationsService} from 'angular2-notifications';
import {AppDataService} from './app-data-service';
import {Router} from '@angular/router';
import {Utils} from './utils';

@Injectable({
    providedIn: 'root',
})
export class AppService {

    private progressObs = new Subject<boolean>();
    progressAnnounced$ = this.progressObs.asObservable();

    constructor(private notif: NotificationsService,
                private appDataService: AppDataService,
                private router: Router) {
    }

    setProgress(boolVal: boolean) {
        this.progressObs.next(boolVal);
    }

    checkVer() {
        let storVal = isDevMode() ? locStorItems.ver_test : locStorItems.ver;
        let updated = isDevMode() ? locStorItems.updated_test : locStorItems.updated;
        this.appDataService.ver().subscribe(data => {
            if (localStorage.getItem(storVal) == null) {
                localStorage.setItem(storVal, data.ver.toString());
                localStorage.setItem(updated, Utils.millsToDateStr(Date.now()));
                location.reload();
            } else {
                if (data.ver > Number.parseInt(localStorage.getItem(storVal))) {
                    localStorage.setItem(storVal, data.ver.toString());
                    localStorage.setItem(updated, Utils.millsToDateStr(Date.now()));
                    location.reload();
                }
            }
        }, error => this.notif.error(error.message));
    }

}
