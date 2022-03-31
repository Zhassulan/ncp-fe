import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DateRangeService} from './date-range.service';
import {DateRangeMills} from '../payments/model/date-range-mills';

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent {

  pickerAfterDate = new FormControl();
  pickerBeforeDate = new FormControl();

  constructor(private dateRangeService: DateRangeService) {
    // remote requests from service to set date for date pickers
    this.dateRangeService.setAfterDateAnnounced$.subscribe(after => this.after = after);
    this.dateRangeService.setBeforeDateAnnounced$.subscribe(before => this.before = before);
  }

  afterDateChanged() {
    this.setTime();
    this.dateRangeService.announceDateRange(new DateRangeMills(this.pickerAfterDate.value.getTime(),
      this.pickerBeforeDate.value.getTime()));
  }

  beforeDateChanged() {
    this.setTime();
    this.dateRangeService.announceDateRange(new DateRangeMills(this.pickerAfterDate.value.getTime(),
      this.pickerBeforeDate.value.getTime()));
  }

  public setTime() {
    const st = new Date(this.pickerAfterDate.value.getTime());
    const en = new Date(this.pickerBeforeDate.value.getTime());
    st.setHours(0, 0, 0, 0);
    en.setHours(23, 59, 59, 999);
    this.after = st;
    this.before = en;
  }

  setDates(after, before) {
    this.after = after;
    this.before = before;
    this.pickerAfterDate.setValue(after);
    this.pickerBeforeDate.setValue(before);
  }

  set after(date) {
    const s = new Date(date);
    s.setHours(0, 0, 0, 0);
    this.pickerAfterDate.setValue(s);
  }

  set before(date) {
    const s = new Date(date);
    s.setHours(23, 59, 59, 999);
    this.pickerBeforeDate.setValue(s);
  }

  get after() {
    return this.pickerAfterDate.value.getTime();
  }

  get before() {
    return this.pickerBeforeDate.value.getTime();
  }
}
