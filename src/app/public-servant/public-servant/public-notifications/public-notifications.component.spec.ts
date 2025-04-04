import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicNotificationsComponent } from './public-notifications.component';

describe('PublicNotificationsComponent', () => {
  let component: PublicNotificationsComponent;
  let fixture: ComponentFixture<PublicNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
