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
    // return localStorage.getItem('userId');
    const userId = localStorage.getItem('userId');
    return userId ? Number(userId) : null;
    
  }
  

  loadUser(): void {
    const userId = this.getUserIdFromLocalStorage1();
    console.log("User ID:", userId);
    
    if (userId) {
      this.authService.getUserProfile(userId).subscribe((response) => {
        console.log("Users received:", response);
        const user = response._embedded || [];

        this.user = user;

      // Populate form
      this.profileForm.patchValue({
        fullName: user.fullName,
        nationalId: user.nationalId,
        email: user.email,
        userType: user.userType,
        password: user.password,
        locationId: user.location?.locationId,
        phoneNumber: user.phoneNumber
      });
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
    const userId = this.getUserIdFromLocalStorage1();  // Make sure this is a primitive value (string or number)
    console.log("user id:", userId);  // Check the userId value here to ensure it's correct.
    console.log("register", this.profileForm.value);
  
    const updatedUser: User = {
      userId: userId, 
      fullName: this.profileForm.get('fullName')?.value,
      nationalId: this.profileForm.get('nationalId')?.value,
      email: this.profileForm.get('email')?.value,
      password: this.profileForm.get('password')?.value,
      location: { locationId: this.profileForm.get('locationId')?.value },
      userType: this.profileForm.get('userType')?.value,
      phoneNumber: this.profileForm.get('phoneNumber')?.value,
    };
    console.log("updated user", updatedUser);
  
    if (userId) {
      this.authService.updateUser(userId, updatedUser).subscribe({
        next: (response) => {
          this.toastr.success('User updated successfully!', 'Success');
          this.loadUser();
        },
        error: (err) => {
          console.error("update failed", err);
          this.toastr.error("update failed. Please try again.", 'Error');
        }
      });
    } else {
      console.warn("User ID not found in localStorage.");
    }
  }
  

}
