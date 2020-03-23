import {Injectable} from '@angular/core';
import {Registry} from './model/registry';
import {msgs, rests} from '../settings';
import {Observable, Subject} from 'rxjs';
import {NGXLogger} from 'ngx-logger';
import {UserService} from '../user/user.service';
import {PayDataService} from '../data/pay-data-service';

@Injectable({
    providedIn: 'root',
})
export class RegistryService {

    registry: Registry;
    private registryObs = new Subject<Registry>();
    registryAnnounced$ = this.registryObs.asObservable();

    constructor(private logger: NGXLogger,
                private userService: UserService,
                private payDataService: PayDataService) {
    }

    announceRegistry() {
        this.registryObs.next(this.registry);
    }

    public loadRegistry(id) {
        console.log('Загрузка реестра ID ' + id);
        return new Observable(
            observer => {
                this.payDataService.getRegistry(id).subscribe(data => {
                        if (data.result == rests.restResultOk) {
                            this.registry = data.data;
                            this.announceRegistry();
                            observer.next(this.registry);
                        }
                        if (data.result == rests.restResultErr) {
                            this.logger.error(data.data);
                            observer.error(msgs.msgErrGetRegistryData);
                        }
                    },
                    error2 => {
                        let msg = msgs.msgErrGetDetails + error2 + this.userService.logUser();
                        this.logger.error(msg);
                        observer.error(msgs.msgErrGetRegistryData);
                    },
                    () => {
                        observer.complete();
                    });
            });
    }

}
