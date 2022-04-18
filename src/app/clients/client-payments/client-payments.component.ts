import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ClientService} from '../client.service';
import {DateRangeComponent} from '../../date-range/date-range.component';
import {DateRangeService} from '../../date-range/date-range.service';
import {ActivatedRoute} from '@angular/router';
import {concatMap, tap} from 'rxjs';
import {PaymentsService} from '../../payments/payments.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DateRangeMills} from '../../payments/model/date-range-mills';

@Component({
  selector: 'app-client-payments',
  templateUrl: './client-payments.component.html',
  styleUrls: ['./client-payments.component.scss']
})
export class ClientPaymentsComponent implements AfterViewInit {

  @ViewChild(DateRangeComponent)
  dateRange: DateRangeComponent;

  constructor(private clientService: ClientService,
              private dateRangeService: DateRangeService,
              private route: ActivatedRoute,
              private paymentsService: PaymentsService,
              private snackbar: MatSnackBar) {
  }

  ngAfterViewInit(): void {
    const profileId: number = this.route.snapshot.params['id'];
    let minDateByProfile: number;
    let maxDateByProfile: number;
    this.paymentsService.minDateByProfile(profileId).pipe(
      tap(res => minDateByProfile = res),
      concatMap(() => this.paymentsService.maxDateByProfile(profileId)),
      tap(res => maxDateByProfile = res),
    ).subscribe({
      next: () => {
        this.dateRangeService.announceDateRange(new DateRangeMills(minDateByProfile, maxDateByProfile));
        this.dateRangeService.announceAfterDate(minDateByProfile);
        this.dateRangeService.announceBeforeDate(maxDateByProfile);
      },
      error: (err) => this.snackbar.open(err.error)
    });
  }

  get client() {
    return this.clientService.client;
  }
}
