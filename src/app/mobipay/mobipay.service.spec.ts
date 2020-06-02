import { TestBed } from '@angular/core/testing';

import { MobipayService } from './mobipay.service';

describe('MobipayService', () => {
  let service: MobipayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobipayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
