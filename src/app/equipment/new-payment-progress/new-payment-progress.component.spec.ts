import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPaymentProgressComponent } from './new-payment-progress.component';

describe('NewPaymentProgressComponent', () => {
  let component: NewPaymentProgressComponent;
  let fixture: ComponentFixture<NewPaymentProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPaymentProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPaymentProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
