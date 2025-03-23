import { Component, Input } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../../services/event.service';
import { ProjectService } from '../../services/project.service';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../components/footer/footer.component";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Component({
  selector: 'app-all-projects-section',
  standalone: true,
  imports: [NavbarComponent, ProjectCardComponent, CommonModule, FooterComponent],
  templateUrl: './all-projects-section.component.html',
  styleUrl: './all-projects-section.component.css'
})
export class AllProjectsSectionComponent {

  @Input() project: any;
  projects =[];

  constructor(
    private projectService: ProjectService, 
    
  ) {}

  searchTerm = new BehaviorSubject<string>('');

  ngOnInit(): void {
    this.getAllProjects();
  }

  getAllProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (response: any) => {
        if (!response || !response._embedded) {
          console.error("Invalid response format");
          return;
        }
        this.projects = response._embedded.map((project: any) => ({
          ...project,
          base64EncodedImage: project.base64EncodedImage?.startsWith("data:image/")
            ? project.base64EncodedImage
            : `data:image/jpeg;base64,${project.base64EncodedImage}`
        }));
        console.log("All Projects:", this.projects);
      },
      error: (err) => console.error("Failed to load projects:", err)
    });
  }

  onSearch(event: any) {
    this.searchTerm.next(event.target.value);
  }

}
