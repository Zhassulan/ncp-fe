import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {Payment} from '../payment/model/payment';
import {PaymentsTableComponent} from './payments-table/payments-table-component';
import {DateRangeService} from '../date-range/date-range.service';
import {Utils} from '../utils';
import {DateRangeMills} from './model/date-range-mills';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements AfterViewInit {

  @ViewChild(PaymentsTableComponent)
  private paymentsTableComponent: PaymentsTableComponent;

  selection = new SelectionModel<Payment>(true, []);

  constructor(private dateRangeService: DateRangeService) {
  }

  ngAfterViewInit(): void {
    const after = Utils.getTodayStartTime().getTime();
    const before = Utils.getTodayEndTime().getTime();
    this.dateRangeService.announceAfterDate(after);
    this.dateRangeService.announceBeforeDate(before);
    this.dateRangeService.announceDateRange(new DateRangeMills(after, before));
  }

  get dataSource() {
    return this.paymentsTableComponent.dataSource;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  export() {
    this.paymentsTableComponent.export();
  }

  transitSelected() {
    // this.paymentsTableComponent.transitSelected();
  }
}
