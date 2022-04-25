import { TestBed } from '@angular/core/testing';

import { RawPaymentsService } from './raw-payments.service';

describe('RawPaymentsService', () => {
  let service: RawPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RawPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
