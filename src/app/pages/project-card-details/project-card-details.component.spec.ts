import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCardDetailsComponent } from './project-card-details.component';

describe('ProjectCardDetailsComponent', () => {
  let component: ProjectCardDetailsComponent;
  let fixture: ComponentFixture<ProjectCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
