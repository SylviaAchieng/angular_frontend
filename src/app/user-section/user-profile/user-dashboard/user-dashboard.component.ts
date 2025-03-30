import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IssueService } from '../../../services/issue.service';
import { IdType } from '../../../types/app';

type IssueStas = {
  statusCount ?: {
    RESOLVED ?: number,
    CANCELLED ?: number,
    CREATED ?: number,
    PENDING ?: number,
    PARKED ?: number
}
}


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
  }

  getUserIdFromLocalStorage1(): IdType | null {
      return localStorage.getItem('userId');
      
    }


  getIssuesByUserId() {
  const userData = localStorage.getItem('user'); 

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

      const issueStats: IssueStas = response.metadata;
      this.pendingIssuesCount = issueStats.statusCount?.CREATED || 0;
      this.inProgressIssuesCount = issueStats.statusCount?.PENDING || 0;
      this.resolvedIssuesCount = issueStats.statusCount?.RESOLVED || 0;

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
    console.log("issues state updated with images:", this.issues);
  });
}


}
