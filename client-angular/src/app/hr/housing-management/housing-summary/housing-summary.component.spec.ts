import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousingSummaryComponent } from './housing-summary.component';

describe('HousingSummaryComponent', () => {
  let component: HousingSummaryComponent;
  let fixture: ComponentFixture<HousingSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HousingSummaryComponent]
    });
    fixture = TestBed.createComponent(HousingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
