import {BehaviorSubject, finalize, Observable, of, Subscription} from 'rxjs';
import {PaymentDto} from '../payment/dto/paymentDto';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {PaymentsService} from './payments.service';
import {catchError} from 'rxjs/operators';
import {GetPaymentsPaginationParams} from './model/get-payments-pagination-params';
import {DateRangeMills} from './model/date-range-mills';

export class PaymentsDataSource implements DataSource<PaymentDto> {

  private paymentsSubject = new BehaviorSubject<PaymentDto[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private paymentsService: PaymentsService) {
  }

  connect(collectionViewer: CollectionViewer): Observable<PaymentDto[]> {
    return this.paymentsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.paymentsSubject.complete();
    this.loadingSubject.complete();
  }

  loadPayments(dateRange: DateRangeMills,
               profileId: number,
               paginationParam: GetPaymentsPaginationParams): Subscription {

    this.loadingSubject.next(true);
    return this.paymentsService.getPayments(dateRange,
      profileId,
      paginationParam)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(payments => this.paymentsSubject.next(payments));
  }
}
