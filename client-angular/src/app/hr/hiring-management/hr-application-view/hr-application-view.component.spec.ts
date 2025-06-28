import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrApplicationViewComponent } from './hr-application-view.component';

describe('HrApplicationViewComponent', () => {
  let component: HrApplicationViewComponent;
  let fixture: ComponentFixture<HrApplicationViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HrApplicationViewComponent]
    });
    fixture = TestBed.createComponent(HrApplicationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
