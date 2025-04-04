import { Component } from '@angular/core';
import { IdType } from '../../../types/app';
import { NotificationService } from '../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

type NotificationStats = {
  statusCounts ?: {
    SENT ?: number,
    READ ?: number,
}
}


@Component({
  selector: 'app-public-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public-notifications.component.html',
  styleUrl: './public-notifications.component.css'
})
export class PublicNotificationsComponent {
  notifications: any[]= [];

   constructor(
        private notificationService: NotificationService,
        private toastr : ToastrService
      ){}

      activeTab: 'all' | 'archive' | 'favorite' = 'all';

  setTab(tab: 'all' | 'archive' | 'favorite') {
    this.activeTab = tab;
  }

  toggleFavorite(notification: Notification) {
    //notification.isFavorite = !notification.isFavorite;
  }

      ngOnInit(): void{
        this.getNotificationsByLocationId();
      }

  pendingNotificationsCount = 0;
    
      getUserIdFromLocalStorage1(): IdType | null {
          return localStorage.getItem('userId');
        }
  
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

}
