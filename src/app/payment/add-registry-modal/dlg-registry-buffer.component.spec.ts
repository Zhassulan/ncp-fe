import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DlgRegistryBufferComponent } from './dlg-registry-buffer.component';

describe('AddRegistryModalComponent', () => {
  let component: DlgRegistryBufferComponent;
  let fixture: ComponentFixture<DlgRegistryBufferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DlgRegistryBufferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DlgRegistryBufferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
