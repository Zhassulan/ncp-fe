import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {

  private progressObs = new Subject<boolean>();
  progressAnnounced$ = this.progressObs.asObservable();

  constructor() {
  }

  start() {
    this.progressObs.next(true);
  }

  stop() {
    this.progressObs.next(false);
  }
}
