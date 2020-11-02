import { TestBed } from '@angular/core/testing';

import { TemplateRepository } from './template-repository.service';

describe('TemplateRepoService', () => {
  let service: TemplateRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
