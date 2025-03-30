import { Component, Input } from '@angular/core';
import { ProjectCommentsService } from '../../services/project-comments.service';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ProjectLikesService } from '../../services/project-likes.service';
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-project-card-details',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, ReactiveFormsModule, MatIcon, MatCardModule, MatButtonModule, MatIconModule, FooterComponent],
  templateUrl: './project-card-details.component.html',
  styleUrl: './project-card-details.component.css'
})
export class ProjectCardDetailsComponent {
  project: any;
  likes: any[] = [];
  comments: any[] = [];
  newComment: string = '';
  showCommentDialog: boolean = false;

  isImageModalOpen = false;
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private commentService: ProjectCommentsService,
    private toastr: ToastrService,
    private likeService: ProjectLikesService
  ) {}

  ngOnInit(): void {
    this.loadProjectDetails();
    const projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadlikes(projectId);
    this.loadComments(projectId);
  }

  openImageModal(imageUrl: string) {
    this.selectedImage = imageUrl;
    this.isImageModalOpen = true;
  }

  closeImageModal() {
    this.isImageModalOpen = false;
    this.selectedImage = null;
  }

  downloadReceipt() {
    if (this.selectedImage) {
      const link = document.createElement('a');
      link.href = this.selectedImage;
      link.download = 'receipt.png'; // Default filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  loadProjectDetails(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    const userId = localStorage.getItem('userId');
  
    if (projectId && userId) {
      this.projectService.getProjectById(projectId).subscribe((response: any) => {
        if (response && response._embedded) {
          const projectData = response._embedded;
          this.project = {
            ...projectData,
            base64EncodedImage: projectData.base64EncodedImage
              ? `data:image/jpg;base64,${projectData.base64EncodedImage}`
              : null,
            base64Encoded: projectData.base64Encoded
              ? `data:image/jpg;base64,${projectData.base64Encoded}`
              : null,
          };
          console.log("Formatted project:", this.project);
        } else {
          console.error("Project data missing in response.");
        }
      });
        this.projectService.projectSubject.subscribe((state: any) => {
        if (state.project) {
          this.project = {
            ...state.project,
            base64EncodedImage: state.project.base64EncodedImage
              ? `data:image/jpg;base64,${state.project.base64EncodedImage}`
              : null,
            base64Encoded: state.project.base64Encoded
              ? `data:image/jpg;base64,${state.project.base64Encoded}`
              : null,  
          };
          console.log("Updated project state:", this.project);
        }
      });
    } else {
      console.error("Missing Project ID or User ID.");
    }
  }
  

  toggleCommentDialog(): void {
    this.showCommentDialog = !this.showCommentDialog;
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
        this.loadComments(this.project.projectId);
      },
      error: (error) => {
        console.error('Error submitting comment:', error);
        this.toastr.error('Failed to submit comment.', 'Error');
      }
    });
  }

  submitLike(): void {
    const userId = localStorage.getItem('userId');
    if (!userId || !this.project?.projectId) {
      this.toastr.info('Project not found. Please try again.', 'Info');
      return;
    }

    this.projectService.likeProject(this.project.projectId).subscribe({
      next: (response) => {
        this.likes = response.likes;
        this.toastr.success('Project liked!', 'Success');
      },
      error: (error) => {
        console.error('Error liking project:', error);
        this.toastr.error('Failed to like project.', 'Error');
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

  goBack(): void {
    this.router.navigate(['/']);
  }

}
