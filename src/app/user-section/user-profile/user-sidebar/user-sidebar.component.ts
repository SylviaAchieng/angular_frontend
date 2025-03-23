import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { LocationService } from '../../../services/location.service';
import { IdType } from '../../../types/app';

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

  user: any = {
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    location: { locationId: '' },
  
  };

  constructor(
      private authService: AuthService,
      private locationService: LocationService,
      private toastr: ToastrService
    ){}

    ngOnInit(): void {
      this.loadUser();
    }

  getUserIdFromLocalStorage(): number | null {
      const userData = localStorage.getItem('user'); // Retrieve stored user details
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData); // Parse JSON string
          return parsedUser.userId; // Extract userId
        } catch (error) {
          console.error('Error parsing user data:', error);
          return null;
        }
      }
      return null;
    }
  
    getUserIdFromLocalStorage1(): IdType | null {
      return localStorage.getItem('userId'); // Retrieve stored user details
      
    }
  
    
    loadUser(): void {
      const userId = this.getUserIdFromLocalStorage1();
      console.log("User ID:", userId);
      
      if (userId) {
        this.authService.getUserProfile(userId).subscribe((response) => {
          console.log("User received:", response);
          this.user = response._embedded || [];
        });
    
        // Subscribe to authSubject to update component state dynamically
        this.authService.authSubject.subscribe((state) => {
          this.user = state.users;
          console.log("User state updated:", this.user);
        });
      } else {
        console.warn("User ID not found in local storage.");
      }
    }

}
