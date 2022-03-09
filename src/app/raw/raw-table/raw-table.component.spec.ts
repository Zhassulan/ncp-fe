import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RawTableComponent } from './raw-table.component';

describe('RawTableComponent', () => {
  let component: RawTableComponent;
  let fixture: ComponentFixture<RawTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RawTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
