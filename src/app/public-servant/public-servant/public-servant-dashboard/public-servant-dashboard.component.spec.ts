import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicServantDashboardComponent } from './public-servant-dashboard.component';

describe('PublicServantDashboardComponent', () => {
  let component: PublicServantDashboardComponent;
  let fixture: ComponentFixture<PublicServantDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicServantDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicServantDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
