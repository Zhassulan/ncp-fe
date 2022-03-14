import { TestBed } from '@angular/core/testing';

import { PaymentV2Service } from './payment-v2.service';

describe('PaymentV2Service', () => {
  let service: PaymentV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
