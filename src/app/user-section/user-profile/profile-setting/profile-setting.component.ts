import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { LocationService } from '../../../services/location.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IdType, User } from '../../../types/app';
import { count } from 'rxjs';

// enum UserType {
//   CITIZEN = 'CITIZEN',
//   PUBLIC_SERVANT = 'PUBLIC_SERVANT'
// }

@Component({
  selector: 'app-profile-setting',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile-setting.component.html',
  styleUrl: './profile-setting.component.css'
})
export class ProfileSettingComponent {
  profileImage: string | null = null;

  locations: any[] = [];
  selectedUser: any = {};
  // userTypeEnum = UserType;

  user: any = {
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    location: { locationId: '' , county: '', subCounty: '' },
  
  };

  users: any = {
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    location: { locationId: ''},
  
  };

  profileForm=new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      nationalId: new FormControl('', [Validators.required]),
      email: new FormControl('',[Validators.required, Validators.email]),
      userType: new FormControl('', [Validators.required]),
      password: new FormControl('',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
      locationId: new FormControl(null, [Validators.required]),
      phoneNumber: new FormControl(''),
      
    });

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
    //this.loadUser();
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
  

  // updateUser() {
  //   const userId = this.getUserIdFromLocalStorage1();
  //   console.log("user id:", userId)
    
  //   if (!userId) {
  //     this.toastr.warning('User ID not found. Please log in again.', 'Warning');
  //     return;
  //   }
  
  //   // if (!this.users || !this.users.userId) {
  //   //   this.toastr.info('Invalid user data. Please try again.', 'Info');
  //   //   return;
  //   // }

  //   const updatedUserData = { ...this.users };
  
  //   console.log("updatedUserData", updatedUserData)
  //   this.authService.updateUser(updatedUserData, userId).subscribe({
  //     next: (updatedUser) => {
  //       console.log('User updated successfully:', updatedUser);
  //       this.users = { ...updatedUser };
  
  //       this.toastr.success('User updated successfully!', 'Success');
  //       this.loadUser();
  //     },
  //     error: (error) => {
  //       console.error('Error updating user:', error);
  //       this.toastr.error('Failed to update user. Please try again.', 'Error');
  //     }
  //   });
  // }


  updateUser(){
    const userId = this.getUserIdFromLocalStorage1();
    console.log("user id:", userId)
      console.log("register", this.profileForm.value)
      const updatedUser: User = {
        fullName: this.profileForm.get('fullName')?.value,
        nationalId: this.profileForm.get('nationalId')?.value,
        email: this.profileForm.get('email')?.value,
        password: this.profileForm.get('password')?.value,
        location: {locationId: this.profileForm.get('locationId')?.value},
        userType: this.profileForm.get('userType')?.value,
        phoneNumber: this.profileForm.get('phoneNumber')?.value,
      }
      console.log("new user", updatedUser);
      this.authService.updateUser(updatedUser, userId).subscribe({
        next:(response)=>{
          this.toastr.success('User updated successfully!', 'Success');
          this.loadUser();
        },
      error: (err) => {
        console.error("update failed", err);
        this.toastr.error("update failed. Please try again.", 'Error');
      }
      });
    }
  


}
