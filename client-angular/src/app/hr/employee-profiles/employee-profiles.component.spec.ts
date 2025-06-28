import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeProfilesComponent } from './employee-profiles.component';

describe('EmployeeProfilesComponent', () => {
  let component: EmployeeProfilesComponent;
  let fixture: ComponentFixture<EmployeeProfilesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeProfilesComponent]
    });
    fixture = TestBed.createComponent(EmployeeProfilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
