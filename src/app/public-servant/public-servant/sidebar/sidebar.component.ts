import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';
import { IdType } from '../../../types/app';

type NotificationStats = {
  statusCounts ?: {
    SENT ?: number,
    READ ?: number,
}
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  user:any = null;
    username: any;
    notifications: any[] = [];

    isOpen = false;
  
    constructor(
      private authService: AuthService,
      private notificationService: NotificationService
    ){}
  
    ngOnInit(): void {
      this.username = localStorage.getItem('fullName');
      console.log('Retrieved Username:', this.username);
      const userId = localStorage.getItem('userId');
      this.authService.authSubject.subscribe(
        (auth)=>{
          console.log("auth state", auth)
          this.user = auth.user;
        }
      )
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

}
