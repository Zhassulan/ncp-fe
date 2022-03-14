import {Component, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {DateRangeComponent} from '../date-range/date-range.component';
import {Payment} from '../payment/model/payment';
import {PaymentsTableComponent} from './payments-table/payments-table.component';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent {

  @ViewChild(DateRangeComponent, {static: true})
  dateRangeComponent: DateRangeComponent;
  @ViewChild(PaymentsTableComponent)
  private paymentsTableComponent: PaymentsTableComponent;
  selection = new SelectionModel<Payment>(true, []);

  get dataSource() {
    return this.paymentsTableComponent.dataSource;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  export() {
    this.paymentsTableComponent.export();
  }

  transitSelected() {
    this.paymentsTableComponent.transitSelected();
  }

  loadData() {
    this.paymentsTableComponent.loadData();
  }
}
