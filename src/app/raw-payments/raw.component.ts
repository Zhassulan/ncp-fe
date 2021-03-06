import {Component, OnInit, ViewChild} from '@angular/core';
import {DateRangeComponent} from '../date-range/date-range.component';
import {SelectionModel} from '@angular/cdk/collections';
import {Payment} from '../payment/model/payment';
import {RawTableComponent} from './raw-table/raw-table.component';

@Component({
  selector: 'app-raw',
  templateUrl: './raw.component.html',
  styleUrls: ['./raw.component.scss']
})
export class RawComponent {

  @ViewChild(DateRangeComponent, {static: true})
  dateRangeComponent: DateRangeComponent;
  selection = new SelectionModel<Payment>(true, []);
  @ViewChild(RawTableComponent)
  private paymentsTableComponent: RawTableComponent;

  constructor() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    /*this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }*/
  }

  export() {
    this.paymentsTableComponent.export();
  }
}
