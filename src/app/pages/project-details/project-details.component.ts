import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../../services/project.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProjectLikesService } from '../../services/project-likes.service';
import { ProjectCommentsService } from '../../services/project-comments.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent {

  @Input() project: any;

  projects: any;

  likes: any[] = [];
  selectedProject: any = null;
  isViewing = false;
  

  comments: any[] = [];
  newComment: string = '';
  showCommentDialog: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private toastr: ToastrService,
    private likeService: ProjectLikesService,
    private commentService: ProjectCommentsService
  ) {}

  projectsTitle = 'Go Vocal is currently working on';
  seeAllText = 'See all projects';

  // Card Content
  projectImage = 'assests/idea.jpg';
  projectAlt = 'Empty Homes Taxes';
  projectDeadline = '2 days remaining';
  urgencyLabel = 'Urgent';
  projectTitle = '5 potential scenarios for the commercial center';
  projectDescription =
    'To address the City’s housing crisis, we are exploring five scenarios for an empty homes tax aimed at commercial centers, called the Empty Homes Tax...';

  // Participants
  participants = [
    { avatar: 'assests/avatar.jpg' },
    { avatar: 'assests/avatar.jpg' },
    { avatar: 'assests/avatar.jpg' },
  ];
  additionalParticipants = '+12 more';

  

  ngOnInit(): void {
    this.loadProjectDetails();
    const projectId = this.project?.projectId;
    this.loadlikes(projectId);
    this.loadComments(projectId);
    
  }


  // loadProjectDetails(projectId: string): void {
  //   this.projectService.getProjectById(projectId).subscribe({
  //     next: (response: any) => {
  //       console.log("Raw API Response:", response); // Debugging
  
  //       if (response && response._embedded) {
  //         this.project = {
  //           ...response._embedded, // Extract nested object
  //           base64EncodedImage: response._embedded.base64EncodedImage
  //             ? `data:image/jpg;base64,${response._embedded.base64EncodedImage}`
  //             : null
  //         };
  //         console.log("Formatted Project Data:", this.project);
  //       } else {
  //         this.toastr.warning("Project details not found", "Warning");
  //       }
  //     },
  //     error: (error) => {
  //       console.error("Failed to load project:", error);
  //       this.toastr.error("Failed to fetch project details", "Error");
  //     }
  //   });
  // }


  loadProjectDetails(): void {
    this.projectService.getActiveProjects().subscribe({
      next: (response: any) => {
        if (response && response._embedded) {
          const projects = response._embedded;
  
          if (Array.isArray(projects) && projects.length > 0) {
            // Ensure all projects have 'daysRemaining' before sorting
            const validProjects = projects.filter(proj => proj.daysRemaining !== undefined && proj.daysRemaining !== null);
  
            if (validProjects.length > 0) {
              // Find the project with the least number of days remaining
              this.project = validProjects.reduce((minProject, currentProject) => 
                currentProject.daysRemaining < minProject.daysRemaining ? currentProject : minProject
              );
  
              // Ensure image format
              if (this.project.base64EncodedImage) {
                this.project.base64EncodedImage = `data:image/jpg;base64,${this.project.base64EncodedImage}`;
              }
  
              console.log("Selected Project (Least Days Remaining):", this.project);
            } else {
              console.warn("No valid projects with 'daysRemaining' found");
              this.project = null;
            }
          } else {
            console.warn("No projects available");
            this.project = null;
          }
        } else {
          console.warn("Invalid API response format");
          this.project = null;
        }
      },
      error: (error) => {
        console.error("Failed to load projects:", error);
        this.toastr.error("Failed to fetch projects", "Error");
        this.project = null;
      }
    });
  }
  

  submitLike() {
    const userId = localStorage.getItem('userId'); // Assuming you store user ID in localStorage
    if (!userId || !this.project?.projectId) {
      this.toastr.info("Project not found. Please try again.", "Info"); 
      return;
    }
  
    const likePayload = {
      project: { projectId: this.project.projectId },
      user: { userId: parseInt(userId) }
    };
    this.likeService.createLikes(likePayload).subscribe({
      next: (response) => console.log('Like submitted:', response),
      error: (error) => console.error('Error:', error)
    });
  }

  createComment(): void {
    const userId = localStorage.getItem('userId');
    if (!userId || !this.project?.projectId) {
      this.toastr.info('Project not found. Please try again.', 'Info');
      return;
    }

    const commentPayload = {
      project: { projectId: this.project.projectId },
      user: { userId: parseInt(userId) },
      comment: this.newComment
    };

    this.commentService.createComment(commentPayload).subscribe({
      next: (response) => {
        this.comments.push(response);
        this.newComment = '';
        this.showCommentDialog = false;
        this.toastr.success('Comment added successfully!', 'Success');
      },
      error: (error) => {
        console.error('Error submitting comment:', error);
        this.toastr.error('Failed to submit comment.', 'Error');
      }
    });
  }

  toggleCommentDialog(): void {
    this.showCommentDialog = !this.showCommentDialog;
  }

  loadlikes(projectId: number) {
    this.likeService.getLikesByProjectId(projectId).subscribe({
      next: (response) => {
        this.likes = response._embedded || []; // Ensure it’s an array
        console.log('likes', response);
      },
      error: (err) => {
        console.error('Error fetching replies:', err);
      }
    });
  }

  loadComments(projectId: number): void {
    this.commentService.getCommentsByProjectId(projectId).subscribe({
      next: (response) => {
        this.comments = response._embedded || []; // Ensure it’s an array
        console.log('comments', response);
      },
      error: (err) => {
        console.error('Error fetching comments:', err);
      }
    });

  }

  showViewIssueModal(event: any): void {
    this.selectedProject = event;
    this.isViewing = true;
  }

  closeViewIssueModal(): void {
    this.isViewing = false;
    this.selectedProject = null;
  }

}
