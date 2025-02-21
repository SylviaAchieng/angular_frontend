import { TestBed } from '@angular/core/testing';

import { ProjectCommentsService } from './project-comments.service';

describe('ProjectCommentsService', () => {
  let service: ProjectCommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectCommentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
