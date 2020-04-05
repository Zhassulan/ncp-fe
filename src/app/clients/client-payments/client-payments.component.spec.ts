import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPaymentsComponent } from './client-payments.component';

describe('ClientPaymentsComponent', () => {
  let component: ClientPaymentsComponent;
  let fixture: ComponentFixture<ClientPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
