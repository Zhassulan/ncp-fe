import { TestBed } from '@angular/core/testing';

import { UploadFilePaymentService } from './upload-file-payment.service';

describe('UploadFilePaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadFilePaymentService = TestBed.get(UploadFilePaymentService);
    expect(service).toBeTruthy();
  });
});
