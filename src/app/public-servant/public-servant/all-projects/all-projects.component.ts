import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UpdateProjectFormComponent } from '../../../pages/update-project-form/update-project-form.component';
import { ProjectService } from '../../../services/project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-projects.component.html',
  styleUrl: './all-projects.component.css'
})
export class AllProjectsComponent {
  @Input() project: any;
    @Output() deleteProjectEvent = new EventEmitter<number>();
  
      projects: any;
      paginatedEvents: any[] = [];
      selectedProject: any = null;
      isViewing = false;
      currentPage = 1;
      visiblePages: number[] = [];
      vipPrice: number = 0;
      regularPrice: number=0;
      totalTickets: number=0;
      itemsPerPage: number=5;
      isDeleted: boolean=false;
  
      isProjectFormVisible = false;
  
      newProject = {
        userId: null,
        title: '',
        description: '',
        daysRemaining: null,
        tag: '',
        base64EncodedImage: '' 
      };
    
    
      constructor(private projectService: ProjectService, public dialog: MatDialog, private toastr: ToastrService) {}
    
    
       ngOnInit(): void {
         this.getAllProjects();
       }
  
      // getAllProjects(): void {
      //   this.projectService.getProjects().subscribe({
      //     next: (response: any) => {
      //       console.log("Projects retrieved successfully:", response);
      
      //       if (!response || !response._embedded) {
      //         console.error("Invalid response format");
      //         return;
      //       }
      //       const formattedProjects = response._embedded.map((project: any) => ({
      //         ...project,
      //         base64EncodedImage: project.base64EncodedImage?.startsWith("data:image/")
      //           ? project.base64EncodedImage  // Already formatted correctly
      //           : `data:image/jpeg;base64,${project.base64EncodedImage}`  // Add prefix only if missing
      //       }));
      //       this.projectService.projectSubject.next({ projects: formattedProjects });
      //     },
      //     error: (err) => {
      //       console.error("Failed to load projects:", err);
      //     }
      //   });
      //   this.projectService.projectSubject.subscribe((state: any) => {
      //     this.projects = state.projects;
      //     console.log("Projects state updated with images:", this.projects);
      //   });
      // }

      getAllProjects(): void {
        const userString = localStorage.getItem('user');
      
        if (!userString) {
          console.warn("No user found in local storage.");
          return;
        }
      
        const user = JSON.parse(userString);
        const locationId = user.location?.locationId;
      
        if (!locationId) {
          console.warn("No location ID found for logged-in user.");
          return;
        }
      
        this.projectService.getProjectByLocationId(locationId).subscribe({
          next: (response: any) => {
            console.log("Projects received:", response);
      
            this.projects = response._embedded?.map((project: any) => ({
              ...project,
              base64EncodedImage: project.base64EncodedImage
                ? `data:image/jpg;base64,${project.base64EncodedImage}`
                : null
            })) || [];
      
            console.log("Formatted events:", this.projects);
          },
          error: (error) => {
            console.error("Error fetching events:", error);
          }
        });
      }
  
      handleDeleteProject(projectId: number){
        this.projectService.deleteProject(this.project.projectId).subscribe();
      }
  
      handleOpenUpdateProjectForm(projectId: number){
            this.dialog.open(UpdateProjectFormComponent);
          }
  
      toggleProjectForm() {
            this.isProjectFormVisible = !this.isProjectFormVisible;
          }   
          
      // Handle image upload
    onImageUpload(event: any) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.newProject.base64EncodedImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  
    // Clear selected image
    clearImage() {
      this.newProject.base64EncodedImage = '';
    }    
  
    createProject() {
      if (!this.newProject.title || !this.newProject.description || this.newProject.daysRemaining === null || !this.newProject.tag || !this.newProject.base64EncodedImage) {
        this.toastr.info('Please fill in all required fields, including an image.', 'Info');
        return;
      }
      const imageData = this.newProject.base64EncodedImage.startsWith("data:image/")
        ? this.newProject.base64EncodedImage.split(",")[1]
        : this.newProject.base64EncodedImage;
    
      const projectData = {
        ...this.newProject,
        base64EncodedImage: imageData  // Send only the Base64 string
      };
      this.projectService.createProject(projectData).subscribe({
        next: (newProject) => {
          this.toastr.success("Project created successfully!", "Success");
          this.isProjectFormVisible = false;
          // Reset the form
          this.newProject = {  
            userId: null,
            title: '',
            description: '',
            daysRemaining: null,
            tag: '',
            base64EncodedImage: ''
          };
        },
        error: (error) => {
          console.error('Error creating project:', error);
          this.toastr.error("Failed to create a project. Please try again.", "Error"); 
        }
      });
    }
    
    updateProject() {
      if (!this.selectedProject || !this.selectedProject.projectId) {
        this.toastr.info('Please select a project to update.', 'Info');
        return;
      }
      const imageData = this.selectedProject.base64EncodedImage.startsWith("data:image/")
        ? this.selectedProject.base64EncodedImage.split(",")[1]
        : this.selectedProject.base64EncodedImage;
    
      const updatedProjectData = {
        ...this.selectedProject,
        base64EncodedImage: imageData  // Send only the Base64 string
      };
      this.projectService.updateProject(updatedProjectData).subscribe({
        next: (updatedProject) => {
          console.log('Project updated successfully:', updatedProject);        
          this.projects = this.projects.map((project: any) =>
            project.projectId === updatedProject.projectId ? updatedProject : project
          );
  
          this.toastr.success("Project updated successfully!", "Success");
        },
        error: (error) => {
          console.error('Error updating project:', error);
          this.toastr.error("Failed to create a project. Please try again.", "Error"); 
        }
      });
    }
  
    deleteProject(projectId: number) {
      if (!confirm('Are you sure you want to delete this project?')) {
        return;
      }
    
      this.projectService.deleteProject(projectId).subscribe({
        next: () => {
          console.log('Project deleted successfully:', projectId);
    
          // Remove the deleted project from the local projects list
          this.projects = this.projects.filter((project: any) => project.projectId !== projectId);
    
          this.toastr.success("Project deleted successfully!", "Success"); // Show success message
        },
        error: (error) => {
          console.error('Error deleting project:', error);
          this.toastr.error("Failed to delete project. Please try again.", "Error"); 
        }
      });
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
        this.selectedProject = event;
        // this.vipPrice = event.ticketTypes.find(t => t.type === 'VIP')?.price || null;
        // this.regularPrice = event.ticketTypes.find(t => t.type === 'Regular')?.price || null;
        // this.totalTickets = event.ticketTypes.reduce((total, t) => total + t.quantity, 0) || null;
        this.isViewing = true;
      }
    
      closeViewEventModal(): void {
        this.isViewing = false;
        this.selectedProject = null;
        this.vipPrice = 0;
        this.regularPrice = 0;
        this.totalTickets = 0;
      }

}
