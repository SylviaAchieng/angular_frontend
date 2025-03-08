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
  selectedProject: any = null;

  users: any = {
    fullName: '',
    email: '',
    idNumber: null,
    password: '',
    location: { county: '' },
    userType: ''
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
    this.loadUsers();
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
  

  loadUsers(): void {
    const userId = this.getUserIdFromLocalStorage1();
    console.log("User ID:", userId);
    
    if (userId) {
      this.authService.getUserProfile(userId).subscribe((response) => {
        console.log("Users received:", response);
        this.users = response._embedded || [];
      });
  
      // Subscribe to authSubject to update component state dynamically
      this.authService.authSubject.subscribe((state) => {
        this.users = state.users;
        console.log("Users state updated:", this.users);
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


}
