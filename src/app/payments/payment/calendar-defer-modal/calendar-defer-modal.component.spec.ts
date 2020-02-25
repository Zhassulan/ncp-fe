import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDeferModalComponent } from './calendar-defer-modal.component';

describe('CalendarDeferModalComponent', () => {
  let component: CalendarDeferModalComponent;
  let fixture: ComponentFixture<CalendarDeferModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarDeferModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarDeferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
