import { Component, HostBinding } from '@angular/core';
import { NotificationService } from '../../../../services/notification.service';
import { CommonModule } from '@angular/common';
import { IdType } from '../../../../types/app';
import { ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

type NotificationStats = {
  statusCounts ?: {
    SENT ?: number,
    READ ?: number,
}
}

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  @HostBinding('class') class = 'notification-component';

  constructor(private notificationService: NotificationService, private route: ActivatedRoute,private toastr: ToastrService) {}
  notifications: any[] = [];

  activeTab: 'all' | 'archive' | 'favorite' = 'all';

  setTab(tab: 'all' | 'archive' | 'favorite') {
    this.activeTab = tab;
  }

  toggleFavorite(notification: Notification) {
    //notification.isFavorite = !notification.isFavorite;
  }

  pendingNotificationsCount= 0;

  ngOnInit() {
      this.getAllNotifications();
    }
  
    getUserIdFromLocalStorage1(): IdType | null {
        return localStorage.getItem('userId');
      }

      getAllNotifications() {
        this.notificationService.getAllNotifications().subscribe({
          next: (response: any) => {
            console.log("Issues retrieved successfully:", response);
      
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
          console.log("notifications state updated with images:", this.notifications);
        });
      }

      // loadNotificationDetails(): void {
      //   const notificationId = this.route.snapshot.paramMap.get('id');
      //   const userId = localStorage.getItem('userId');
      //   if (notificationId && userId) {
      //     this.notificationService.getNotificationById(notificationId).subscribe((response: any) => {
      //       if (response && response._embedded) {
      //         const eventData = response._embedded;
      //         this.notifications = {
      //           ...eventData,
      //         };
      //         console.log("Formatted event:", this.notifications);
      //       } else {
      //         console.error("Event data missing in response.");
      //       }
      //     });
      //     // Subscribe to eventSubject for real-time updates
      //     this.notificationService.notificationSubject.subscribe((state: any) => {
      //       if (state.event) {
      //         this.notifications = {
      //           ...state.event,
      //         };
      //         console.log("Updated notification state:", this.notifications);
      //       }
      //     });
      //   } else {
      //     console.error("Missing notification ID or user ID.");
      //   }
      // }

    //   getNotificationById(notificationId: number): void {
    //     if (notificationId) {
    //       this.notificationService.getNotificationById(notificationId).subscribe({
    //         next: (response) => {
    //           console.log('Discussion Details:', response);
    //           this.notifications = response?._embedded ?? response; 
    //         },
    //         error: (error) => {
    //           console.error('Error fetching discussion details', error);
    //         }
    //       });
    //     } else {
    //       console.error('Missing discussion ID or user ID.');
    //     }
    // }

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
