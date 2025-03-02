import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminChartComponent } from './admin-chart.component';

describe('AdminChartComponent', () => {
  let component: AdminChartComponent;
  let fixture: ComponentFixture<AdminChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
