// project.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projects = [
    // Sample data
    {
      id: 1,
      title: 'Project 1',
      description: 'Description for Project 1',
      image: '/assets/home.jpg',
      daysRemaining: 5,
      tag: 'Urgent',
      tagColor: 'red',
      participants: 10,
      likes: 15,
      comments: 5,
    },
    // Add more projects
  ];

  getProjects() {
    return this.projects;
  }

  getProjectById(id: number) {
    return this.projects.find((project) => project.id === id);
  }
}
