import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { LocationService } from '../../../services/location.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IdType } from '../../../types/app';
import { count } from 'rxjs';

@Component({
  selector: 'app-profile-setting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-setting.component.html',
  styleUrl: './profile-setting.component.css'
})
export class ProfileSettingComponent {
  profileImage: string | null = null;

  //users: any = {};
  locations: any[] = [];
  selectedUser: any = {};
  

  user: any = {
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    location: { locationId: '' , county: '', subCounty: '' },
  
  };

  constructor(
    private authService: AuthService,
    private locationService: LocationService,
    private toastr: ToastrService
  ){}

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  uploadImage(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  ngOnInit(): void {
    this.fetchLocations();
    this.loadUser();
  }


  fetchLocations(): void {
    this.locationService.getAllLocations().subscribe((response) => {
      this.locations = response._embedded || [];
    });
  this.locationService.locationSubject.subscribe((state) => {
    this.locations = state.locations;
    console.log("location state updated:", this.locations);
  });
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
    return localStorage.getItem('userId');
    
  }
  

  loadUser(): void {
    const userId = this.getUserIdFromLocalStorage1();
    console.log("User ID:", userId);
    
    if (userId) {
      this.authService.getUserProfile(userId).subscribe((response) => {
        console.log("Users received:", response);
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
  

  updateUser() {
    const userId = this.getUserIdFromLocalStorage1();
    
    if (!userId) {
      this.toastr.warning('User ID not found. Please log in again.', 'Warning');
      return;
    }
  
    // Ensure user has valid data before updating
    if (!this.user || !this.user.userId) {
      this.toastr.info('Invalid user data. Please try again.', 'Info');
      return;
    }
  
    // Prepare updated user data
    const updatedUserData = { ...this.user };
  
    this.authService.updateUser(updatedUserData, userId).subscribe({
      next: (updatedUser) => {
        console.log('User updated successfully:', updatedUser);
        
        // Update the user object with the new data
        this.user = { ...updatedUser };
  
        this.toastr.success('User updated successfully!', 'Success');
        this.loadUser(); // Reload user data to ensure consistency
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.toastr.error('Failed to update user. Please try again.', 'Error');
      }
    });
  }
  


}
