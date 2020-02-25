import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRegistryModalComponent } from './add-registry-modal.component';

describe('AddRegistryModalComponent', () => {
  let component: AddRegistryModalComponent;
  let fixture: ComponentFixture<AddRegistryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRegistryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRegistryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
