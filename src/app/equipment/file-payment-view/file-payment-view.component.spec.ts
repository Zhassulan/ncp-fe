import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePaymentViewComponent } from './file-payment-view.component';

describe('FilePaymentViewComponent', () => {
  let component: FilePaymentViewComponent;
  let fixture: ComponentFixture<FilePaymentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilePaymentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilePaymentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
