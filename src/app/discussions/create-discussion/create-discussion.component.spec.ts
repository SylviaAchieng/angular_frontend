import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDiscussionComponent } from './create-discussion.component';

describe('CreateDiscussionComponent', () => {
  let component: CreateDiscussionComponent;
  let fixture: ComponentFixture<CreateDiscussionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDiscussionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
