import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityReportComponent } from './facility-report.component';

describe('FacilityReportComponent', () => {
  let component: FacilityReportComponent;
  let fixture: ComponentFixture<FacilityReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FacilityReportComponent],
    });
    fixture = TestBed.createComponent(FacilityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
