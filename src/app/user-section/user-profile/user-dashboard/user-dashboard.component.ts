import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IssueService } from '../../../services/issue.service';
import { IdType } from '../../../types/app';
import { NotificationService } from '../../../services/notification.service';
import { ToastrService } from 'ngx-toastr';

type IssueStas = {
  statusCount ?: {
    RESOLVED ?: number,
    CANCELLED ?: number,
    CREATED ?: number,
    PENDING ?: number,
    PARKED ?: number
}
}

type NotificationStats = {
  statusCounts ?: {
    SENT ?: number,
    READ ?: number,
}
}

enum IssueStatusEnum {
  CREATED = 'CREATED',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED',
  PARKED = 'PARKED'
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
    private issueService: IssueService,
    private notificationService: NotificationService,
    private toastr: ToastrService
  ){}

  issues: any[]= [];
  notifications: any[]= [];

  pendingIssuesCount = 0;
  inProgressIssuesCount = 0;
  resolvedIssuesCount = 0;
  selectedIssue: any = null;
    isViewing = false;
    isDeleted: boolean = false;

    issuesStatus = IssueStatusEnum;

  ngOnInit() {
    this.getIssuesByUserId();
    this.getNotificationsByLocationId();
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


pendingNotificationsCount = 0;

    getNotificationsByLocationId() {
      const userData = localStorage.getItem('user'); 
    
      if (!userData) {
        console.error("User ID not found in localStorage");
        return;
      }
      const loggedInUser = JSON.parse(userData);
      const id = loggedInUser.location.locationId; 
    
      this.notificationService.getNotificationsByLocationId(id).subscribe({
        next: (response: any) => {
          console.log("notification by location retrieved successfully:", response);
    
          if (!response || !response._embedded) {
            console.error("Invalid response format");
            return;
          }
    
          const notificationStats: NotificationStats = response.metadata;
          this.pendingNotificationsCount = notificationStats.statusCounts?.SENT || 0;
          const formattedIssues = response._embedded.map((notification: any) => ({
            ...notification,
          }));
    
          this.notificationService.notificationSubject.next({ notifications: formattedIssues });
        },
        error: (err) => {
          console.error("Failed to load notification:", err);
        }
      });
    
      this.notificationService.notificationSubject.subscribe((state: any) => {
        this.notifications = state.notifications;
        console.log("notifications by location state updated: ", this.notifications);
      });
    }

    getNotificationById(notificationId: number) {
      this.notificationService.getNotificationById(notificationId).subscribe({
        next: (response) => {
          if (response && response._embedded) {
            const updatedNotification = response._embedded;
            updatedNotification.status = 'READ';
  
            // Update the notification list
            this.notifications = this.notifications.map(n =>
              n.id === updatedNotification.id ? updatedNotification : n
            );
            this.toastr.success("Notification marked as read", "Success")
  
            console.log("Notification updated to READ:", updatedNotification);
          }
        },
        error: (error) => console.error("Error fetching notification:", error)
      });
    }

    deleteNotification(notificationId: number) {
      this.notificationService.deleteNotification(notificationId).subscribe({
        next: () => {
          console.log('notifcation deleted successfully:', notificationId);
          this.notifications = this.notifications.filter((notification: any) => notification.notificationId !== notificationId);
  
          this.toastr.success("notifcation deleted successfully!", "Success");
        },
        error: (error) => {
          console.error('Error deleting notifcation:', error);
          this.toastr.error("Failed to delete notifcation. Please try again.", "Error");
        }
      });
    }

    toggleIssueVisibility(issue: any): void {
      issue.isDeleted = !issue.isDeleted;
    }

    showViewIssueModal(event: any): void {
      this.selectedIssue = event;
      this.isViewing = true;
    }

    closeViewIssueModal(): void {
      this.isViewing = false;
      this.selectedIssue = null;
    }


    updateIssue() {
      if (!this.selectedIssue || !this.selectedIssue.issueId) {
        this.toastr.info('Please select a issue to update.', 'Info');
        return;
      }
      const imageData = this.selectedIssue.base64EncodedImage.startsWith("data:image/")
        ? this.selectedIssue.base64EncodedImage.split(",")[1]
        : this.selectedIssue.base64EncodedImage;
  
      const updatedIssueData = {
        ...this.selectedIssue,
        base64EncodedImage: imageData  // Send only the Base64 string
      };
      this.issueService.updateIssue(updatedIssueData).subscribe({
        next: (updatedIssue) => {
          console.log('issue updated successfully:', updatedIssue);
          this.issues = this.issues.map((issue: any) =>
            issue.issueId === updatedIssue.issueId ? updatedIssue : issue
          );
  
          this.toastr.success("Issue updated successfully!", "Success");
        },
        error: (error) => {
          console.error('Error updating issue:', error);
          this.toastr.error("Failed to update a issue. Please try again.", "Error");
        }
      });
    }

    deleteIssue() {
      if (!this.selectedIssue || !this.selectedIssue.issueId) {
        this.toastr.info('Please select a issue to delete.', 'Info');
        return;
      }
    
      const issueId = this.selectedIssue.issueId; // Extract only the ID
    
      this.issueService.deleteIssue(issueId).subscribe({
        next: () => {
          console.log('issue deleted successfully:', issueId);
    
          this.issues = this.issues.filter((issue: any) => issue.issueId !== issueId);
    
          this.toastr.success("issue deleted successfully!", "Success"); // Show success message
          this.closeViewIssueModal(); // Close the modal
        },
        error: (error) => {
          console.error('Error deleting issue:', error);
          this.toastr.error("Failed to delete issue. Please try again.", "Error"); 
        }
      });
    }
}
