import { TestBed } from '@angular/core/testing';

import { MobipayDataService } from './mobipay-data.service';

describe('MobipayDataService', () => {
  let service: MobipayDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobipayDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
