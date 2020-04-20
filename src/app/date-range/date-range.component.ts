import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
    selector: 'app-date-range',
    templateUrl: './date-range.component.html',
    styleUrls: ['./date-range.component.css']
})
export class DateRangeComponent implements OnInit {

    public pickerStartDate = new FormControl(new Date());
    public pickerEndDate = new FormControl(new Date());

    constructor() {    }

    ngOnInit() {    }

    public setTime() {
        let st = new Date(this.pickerStartDate.value.getTime());
        let en = new Date(this.pickerEndDate.value.getTime());
        st.setHours(0, 0, 0, 0);
        en.setHours(23, 59, 59, 999);
        this.start = st;
        this.end = en;
    }

    setDates(startDate, endDate) {
        this.start = startDate;
        this.end = endDate;
    }

    set start(start) {
        let s = new Date(start);
        s.setHours(0, 0, 0, 0);
        this.pickerStartDate.setValue(s);
    }

    set end(end) {
        let s = new Date(end);
        s.setHours(23, 59, 59, 999);
        this.pickerEndDate.setValue(s);
    }

    get start() {
        this.setTime();
        return this.pickerStartDate.value.getTime();
    }

    get end() {
        this.setTime();
        return this.pickerEndDate.value.getTime();
    }

}
