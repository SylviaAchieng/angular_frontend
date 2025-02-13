import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscussionDetailsComponent } from './discussion-details.component';

describe('DiscussionDetailsComponent', () => {
  let component: DiscussionDetailsComponent;
  let fixture: ComponentFixture<DiscussionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscussionDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscussionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
