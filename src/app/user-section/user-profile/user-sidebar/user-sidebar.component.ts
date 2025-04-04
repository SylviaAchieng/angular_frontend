import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { LocationService } from '../../../services/location.service';
import { IdType } from '../../../types/app';
import { NotificationService } from '../../../services/notification.service';

type NotificationStats = {
  statusCounts ?: {
    SENT ?: number,
    READ ?: number,
}
}

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-sidebar.component.html',
  styleUrl: './user-sidebar.component.css'
})
export class UserSidebarComponent {
  profileImage: string | null = null;
  users = {
    fullName: '',
    userType: '',
    avatar: 'assests/avatar.jpg',
    online: true
  };
  notifications: any[] =[];

  user: any = {
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    location: { locationId: '' },
  
  };
  userData : any;

  constructor(
      private authService: AuthService,
      private locationService: LocationService,
      private toastr: ToastrService,
      private notificationService: NotificationService
    ){}

    ngOnInit(): void {
      //this.loadUser();
      this.getNotificationsByLocationId();
      this.getUserIdFromLocalStorage();
    }

  getUserIdFromLocalStorage(){
      const userData = localStorage.getItem('user'); 
      if (userData) {
        this.userData = JSON.parse(userData);
      } else {
        this.userData = {}; // Default value if there's no data
      }
      console.log("siderbar userdata: ", userData)
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData); // Parse JSON string
        } catch (error) {
          console.error('Error parsing user data:', error);
          //return null;
        }
      }
      //return null;
    }
  
    getUserIdFromLocalStorage1(): IdType | null {
      return localStorage.getItem('userId');
      
    }
  
    
    loadUser(): void {
      const userId = this.getUserIdFromLocalStorage1();
      console.log("User ID:", userId);
      
      if (userId) {
        this.authService.getUserProfile(userId).subscribe((response) => {
          console.log("User received-sidebar:", response);
          this.user = response._embedded || [];
          sessionStorage.setItem('userDetails', JSON.stringify(this.user));

        });
    
        // Subscribe to authSubject to update component state dynamically
        this.authService.authSubject.subscribe((state) => {
          this.user = state.users;
          //console.log("User state updated:", this.user);
        });
      } else {
        console.warn("User ID not found in local storage.");
      }
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

}
