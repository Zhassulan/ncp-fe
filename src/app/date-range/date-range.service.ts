import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {DateRangeMills} from '../payments/model/date-range-mills';

@Injectable({
  providedIn: 'root'
})
export class DateRangeService {

  private dateRangeAnnounced = new Subject<DateRangeMills>();
  dateRangeAnnounced$ = this.dateRangeAnnounced.asObservable();

  private dateRangeComponentSetAfterDateAnnounced = new Subject<number>();
  setAfterDateAnnounced$ = this.dateRangeComponentSetAfterDateAnnounced.asObservable();

  private dateRangeComponentSetBeforeDateAnnounced = new Subject<number>();
  setBeforeDateAnnounced$ = this.dateRangeComponentSetBeforeDateAnnounced.asObservable();

  private _dateRange: DateRangeMills = new DateRangeMills(new Date().getTime(), new Date().getTime());

  constructor() {
  }

  announceDateRange(value) {
    this._dateRange = value;
    this.dateRangeAnnounced.next(value);
  }

  announceAfterDate(value) {
    this._dateRange.after = value;
    this.dateRangeComponentSetAfterDateAnnounced.next(value);
  }

  announceBeforeDate(value) {
    this._dateRange.before = value;
    this.dateRangeComponentSetBeforeDateAnnounced.next(value);
  }

  get dateRange(): DateRangeMills {
    return this._dateRange;
  }

  isInvalidLoadDataRequest(): boolean {
    return (!this.dateRange || (!this.dateRange.after || false) ||
      (!this.dateRange.before || false));
  }
}
