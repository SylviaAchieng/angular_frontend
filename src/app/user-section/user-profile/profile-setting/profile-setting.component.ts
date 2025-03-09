import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { LocationService } from '../../../services/location.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IdType } from '../../../types/app';

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

  user: any = {};

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
  

 fetchLocations(): void {
  this.locationService.getAllLocations().subscribe((response) => {
    this.locations = response._embedded || [];
  });
this.locationService.locationSubject.subscribe((state) => {
  this.locations = state.locations;
  console.log("location state updated:", this.locations);
});
}

updateEvent() {
  if (!this.selectedUser || !this.selectedUser.eventId) {
    this.toastr.info('Please select an event to update.', 'Info');
    return;
  }

  const userId = this.getUserIdFromLocalStorage1();

  const updatedEventData = {
    ...this.selectedUser,
    
  };
  this.authService.updateUser(updatedEventData, userId).subscribe({
    next: (updatedEvent) => {
      console.log('event updated successfully:', updatedEvent);        
      this.user = this.user.map((user: any) =>
        user.userId === updatedEvent.userId ? updatedEvent : user
      );

      this.toastr.success('event updated successfully!', 'Success');
      this.loadUser();
    },
    error: (error) => {
      console.error('Error updating event:', error);
      this.toastr.error("Failed to update an event. Please try again.", "Error"); 
    }
  });
}


}
