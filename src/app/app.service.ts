import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {locStorItems, msgs} from './settings';
import {NotificationsService} from 'angular2-notifications';
import {DataService} from './data/data.service';

@Injectable()
export class AppService {

    private progressObs = new Subject<boolean>();
    progressAnnounced$ = this.progressObs.asObservable();

    constructor(private dataService: DataService,
                private notif: NotificationsService) {
    }

    setProgress(boolVal: boolean) {
        this.progressObs.next(boolVal);
    }

    checkVersion()  {
        this.dataService.getVersion().subscribe(data => {
            if (localStorage.getItem(locStorItems.version) == null) {
                localStorage.setItem(locStorItems.version, data.ver.toString());
                this.notif.info(msgs.msgInfRefreshPage);
            }   else {
                if (data.ver > Number.parseInt(localStorage.getItem(locStorItems.version)))  {
                    localStorage.setItem(locStorItems.version, data.ver.toString());
                    this.notif.info(msgs.msgInfRefreshPage);
                }
            }
        });
    }

}
