import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDiscussionsComponent } from './all-discussions.component';

describe('AllDiscussionsComponent', () => {
  let component: AllDiscussionsComponent;
  let fixture: ComponentFixture<AllDiscussionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDiscussionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllDiscussionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
