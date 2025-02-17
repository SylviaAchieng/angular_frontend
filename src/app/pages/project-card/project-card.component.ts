import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProjectFormComponent } from '../../pages/update-project-form/update-project-form.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../services/project.service';
import { ProjectLikesService } from '../../services/project-likes.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, MatIcon, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() project: any;
  @Output() deleteProjectEvent = new EventEmitter<number>();

  newLike: string = ''; 
  likes: any[] = [];


  constructor(public dialog: MatDialog, 
    private projectService: ProjectService, 
    private likeService: ProjectLikesService, 
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private authService: AuthService
  
  ){}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      console.log('Logged-in user:', user);
    });
    const projectId = this.project?.projectId;
    this.loadlikes(projectId);
  }

  submitLike() {
    const userId = localStorage.getItem('userId');
    if (!userId || !this.project?.projectId) {
      this.toastr.info("Project not found. Please try again.", "Info"); 
      return;
    }
  
    const likePayload = {
      project: { projectId: this.project.projectId },
      user: { userId: parseInt(userId) }
    };
  
    this.likeService.createLikes(likePayload).subscribe({
      next: (response) => {
        console.log('Like submitted:', response);
        this.loadlikes(this.project.projectId); 
      },
      error: (error) => console.error('Error:', error)
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
  
  

}
