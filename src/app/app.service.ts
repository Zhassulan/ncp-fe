import {Injectable, isDevMode} from '@angular/core';
import {Subject} from 'rxjs';
import {locStorItems, MSG} from './settings';
import {NotificationsService} from 'angular2-notifications';
import {AppDataService} from './data/app-data-service';

@Injectable({
    providedIn: 'root',
})
export class AppService {

    private progressObs = new Subject<boolean>();
    progressAnnounced$ = this.progressObs.asObservable();

    constructor(private notif: NotificationsService,
                private appDataService: AppDataService) {
    }

    setProgress(boolVal: boolean) {
        this.progressObs.next(boolVal);
    }

    checkVer() {
        let storVal = isDevMode() ? locStorItems.ver_test : locStorItems.ver;
        this.appDataService.ver().subscribe(data => {
            if (localStorage.getItem(storVal) == null) {
                localStorage.setItem(storVal, data.ver.toString());
                this.notif.info(MSG.updateCache);
            } else {
                if (data.ver > Number.parseInt(localStorage.getItem(storVal))) {
                    localStorage.setItem(storVal, data.ver.toString());
                    this.notif.info(MSG.updateCache);
                }
            }
        }, error => this.notif.error(error.error.errm));
    }

}
