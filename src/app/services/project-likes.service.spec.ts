import { TestBed } from '@angular/core/testing';

import { ProjectLikesService } from './project-likes.service';

describe('ProjectLikesService', () => {
  let service: ProjectLikesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectLikesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
