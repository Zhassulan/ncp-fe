import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {locStorItems, msgs} from './settings';
import {NotificationsService} from 'angular2-notifications';
import {NGXLogger} from 'ngx-logger';
import {AppDataService} from './data/app-data-service';

@Injectable({
    providedIn: 'root',
})
export class AppService {

    private progressObs = new Subject<boolean>();
    progressAnnounced$ = this.progressObs.asObservable();

    constructor(private notif: NotificationsService,
                private logger: NGXLogger,
                private appDataService: AppDataService) {
    }

    setProgress(boolVal: boolean) {
        this.progressObs.next(boolVal);
    }

    checkVer() {
        this.appDataService.ver().subscribe(data => {
            if (localStorage.getItem(locStorItems.ver) == null) {
                localStorage.setItem(locStorItems.ver, data.ver.toString());
                this.notif.info(msgs.msgInfRefreshPage);
            } else {
                if (data.ver > Number.parseInt(localStorage.getItem(locStorItems.ver))) {
                    localStorage.setItem(locStorItems.ver, data.ver.toString());
                    this.notif.info(msgs.msgInfRefreshPage);
                }
            }
        }, error2 => {
            this.logger.error(error2);
        });
    }

}
