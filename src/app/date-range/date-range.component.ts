import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatDatepickerInputEvent} from '@angular/material';

@Component({
    selector: 'app-date-range',
    templateUrl: './date-range.component.html',
    styleUrls: ['./date-range.component.css']
})
export class DateRangeComponent implements OnInit {

    public pickerStartDate = new FormControl(new Date());
    public pickerEndDate = new FormControl(new Date());

    constructor() {
    }

    ngOnInit() {
    }

    public setTimeBoundariesForDatePickers() {
        let dtStartDay = new Date(this.pickerStartDate.value.getTime());
        let dtEndDay = new Date(this.pickerEndDate.value.getTime());
        dtStartDay.setHours(0, 0, 0, 0);
        dtEndDay.setHours(23, 59, 59, 999);
        this.pickerStartDate.setValue(dtStartDay);
        this.pickerEndDate.setValue(dtEndDay);
    }

    catchEndDatePickerEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        if (type == 'input') {
            let end = new Date(this.pickerEndDate.value);
            end.setHours(23, 59, 59, 999);
            this.pickerEndDate.setValue(end);
        }
    }

    setCalendarToDate(startDate, endDate) {
        let dtStartDay = new Date(startDate);
        let dtEndDay = new Date(endDate);
        dtStartDay.setHours(0, 0, 0, 0);
        dtEndDay.setHours(23, 59, 59, 999);
        //console.log(dtStartDay);
        //console.log(dtEndDay);
        this.pickerStartDate.setValue(dtStartDay);
        this.pickerEndDate.setValue(dtEndDay);
    }

}
