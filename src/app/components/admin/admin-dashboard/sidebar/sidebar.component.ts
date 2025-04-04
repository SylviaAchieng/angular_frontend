import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { NotificationService } from '../../../../services/notification.service';
import { IdType } from '../../../../types/app';

type NotificationStats = {
  statusCounts ?: {
    SENT ?: number,
    READ ?: number,
}
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  user:any = null;
  username: any;

  pendingNotificationsCount = 0;
  notifications: any[] = [];

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

    this.getAllNotifications();
  }

  isSidebarOpen = false;
  isMobile = window.innerWidth < 768;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 768;
    if (!this.isMobile) {
      this.isSidebarOpen = true; // Always open on larger screens
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
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

    markNotificationsAsRead() {
      console.log("updating count:")
      this.notificationService.markAllAsRead().subscribe({
        next: () => {
          this.pendingNotificationsCount = 0; // Reset count in sidebar
        },
        error: (err) => {
          console.error("Failed to mark notifications as read:", err);
        }
      });
    }
    
}
