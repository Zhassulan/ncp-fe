import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPaymentsTableComponent } from './client-payments-table.component';

describe('ClientPaymentsTableComponent', () => {
  let component: ClientPaymentsTableComponent;
  let fixture: ComponentFixture<ClientPaymentsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientPaymentsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPaymentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
