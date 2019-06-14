import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class AppService {

    private progressObs = new Subject<boolean>();
    progressAnnounced$ = this.progressObs.asObservable();

    constructor() {
    }

    setProgress(boolVal: boolean) {
        this.progressObs.next(boolVal);
    }

}
