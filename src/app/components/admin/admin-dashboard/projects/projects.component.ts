import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ProjectService } from '../../../../services/project.service';
import { EventService } from '../../../../services/event.service';
import { UpdateProjectFormComponent } from '../../../../pages/update-project-form/update-project-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  @Input() project: any;
  @Output() deleteProjectEvent = new EventEmitter<number>();

    projects: any;
    paginatedEvents: any[] = [];
    selectedEvent: any = null;
    isViewing = false;
    currentPage = 1;
    visiblePages: number[] = [];
    vipPrice: number = 0;
    regularPrice: number=0;
    totalTickets: number=0;
    itemsPerPage: number=5;
    isDeleted: boolean=false;
  
  
    constructor(private eventService: ProjectService, public dialog: MatDialog) {}
  
  
     ngOnInit(): void {
       this.loadEvents();
     }
  
     loadEvents(): void {
      this.eventService.getProjects().subscribe(projects => {
        console.log("projects received:", projects); // Debugging
        this.projects = projects._embedded || []; 
        
      });
  
      // Subscribe to projectSubject to update component state
    this.eventService.projectSubject.subscribe((state) => {
      this.projects = state.projects;
      console.log("projects state updated:", this.projects);
    });
    }

    handleDeleteProject(projectId: number){
      this.eventService.deleteProject(this.project.projectId).subscribe();
    }

    handleOpenUpdateProjectForm(projectId: number){
          this.dialog.open(UpdateProjectFormComponent);
        }
  
    updatePagination(): void {
      const totalPages = Math.ceil(this.projects.length / this.itemsPerPage);
      this.visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);
      this.setPage(this.currentPage);
    }
  
    setPage(page: number): void {
      if (page < 1 || page > this.visiblePages.length) return;
      this.currentPage = page;
      const startIndex = (page - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedEvents = this.projects.slice(startIndex, endIndex);
    }
  
    previousPage(): void {
      if (this.currentPage > 1) {
        this.setPage(this.currentPage - 1);
      }
    }
  
    nextPage(): void {
      if (this.currentPage < this.visiblePages.length) {
        this.setPage(this.currentPage + 1);
      }
    }
  
    toggleEventVisibility(event: any): void {
      event.isDeleted = !event.isDeleted;
    }
  
    showViewEventModal(event: any): void {
      this.selectedEvent = event;
      // this.vipPrice = event.ticketTypes.find(t => t.type === 'VIP')?.price || null;
      // this.regularPrice = event.ticketTypes.find(t => t.type === 'Regular')?.price || null;
      // this.totalTickets = event.ticketTypes.reduce((total, t) => total + t.quantity, 0) || null;
      this.isViewing = true;
    }
  
    closeViewEventModal(): void {
      this.isViewing = false;
      this.selectedEvent = null;
      this.vipPrice = 0;
      this.regularPrice = 0;
      this.totalTickets = 0;
    }

}
