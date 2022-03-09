import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgYesNoComponent } from './dlg-yes-no.component';

describe('DlgYesNoComponent', () => {
  let component: DlgYesNoComponent;
  let fixture: ComponentFixture<DlgYesNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DlgYesNoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgYesNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
