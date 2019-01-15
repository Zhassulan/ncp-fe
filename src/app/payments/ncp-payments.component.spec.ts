import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NcpPaymentsComponent } from './ncp-payments.component';

describe('NcpPaymentsComponent', () => {
  let component: NcpPaymentsComponent;
  let fixture: ComponentFixture<NcpPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NcpPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NcpPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
