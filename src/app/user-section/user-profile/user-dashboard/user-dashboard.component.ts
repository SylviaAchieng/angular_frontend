import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IssueService } from '../../../services/issue.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {

  constructor(
    private issueService: IssueService
  ){}

  issues: any[]= []

  pendingIssuesCount = 0;
  inProgressIssuesCount = 0;
  resolvedIssuesCount = 0;

  ngOnInit() {
    this.getIssuesByUserId();
    this.getAllIssues();
    
  }

  loadIssueCounts() {
    this.issueService.getIssuesByStatus('Pending').subscribe(data => {
      this.pendingIssuesCount = data.length;
    });

    this.issueService.getIssuesByStatus('In Progress').subscribe(data => {
      this.inProgressIssuesCount = data.length;
    });

    this.issueService.getIssuesByStatus('Resolved').subscribe(data => {
      this.resolvedIssuesCount = data.length;
    });
  }

  getIssuesByUserId() {
  const userData = localStorage.getItem('user'); // Retrieve user ID from localStorage

  if (!userData) {
    console.error("User ID not found in localStorage");
    return;
  }
  const loggedInUser = JSON.parse(userData);
  const id = loggedInUser.userId; 

  this.issueService.getIssuesByUserId(id).subscribe({
    next: (response: any) => {
      console.log("Issues retrieved successfully:", response);

      if (!response || !response._embedded) {
        console.error("Invalid response format");
        return;
      }

      const formattedIssues = response._embedded.map((issue: any) => ({
        ...issue,
        base64EncodedImage: issue.base64EncodedImage?.startsWith("data:image/")
          ? issue.base64EncodedImage
          : `data:image/jpeg;base64,${issue.base64EncodedImage}`
      }));

      this.issueService.issueSubject.next({ issues: formattedIssues });
    },
    error: (err) => {
      console.error("Failed to load issues:", err);
    }
  });

  this.issueService.issueSubject.subscribe((state: any) => {
    this.issues = state.issues;
    console.log("Projects state updated with images:", this.issues);
  });
}


  getAllIssues(): void {
    this.issueService.getAllIssues().subscribe({
      next: (response: any) => {
        console.log("issues retrieved successfully:", response);
  
        if (!response || !response._embedded) {
          console.error("Invalid response format");
          return;
        }
        const formattedIssues = response._embedded.map((issue: any) => ({
          ...issue,
          base64EncodedImage: issue.base64EncodedImage?.startsWith("data:image/")
            ? issue.base64EncodedImage  // Already formatted correctly
            : `data:image/jpeg;base64,${issue.base64EncodedImage}`  // Add prefix only if missing
        }));
        this.issueService.issueSubject.next({ issues: formattedIssues });
      },
      error: (err) => {
        console.error("Failed to load projects:", err);
      }
    });
    this.issueService.issueSubject.subscribe((state: any) => {
      this.issues = state.issues;
      console.log("Projects state updated with images:", this.issues);
    });
  }
}
