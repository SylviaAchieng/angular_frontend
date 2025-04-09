import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LocationService } from '../../services/location.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../types/app';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

enum UserType {
  CITIZEN = 'CITIZEN',
  PUBLIC_SERVANT = 'PUBLIC_SERVANT'
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NavbarComponent, RouterLink, ReactiveFormsModule, FormsModule, CommonModule, MatProgressSpinnerModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private authService: AuthService, private router: Router, private locationService: LocationService, private toastr: ToastrService){}

  registrationForm=new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    nationalId: new FormControl('', [Validators.required]),
    email: new FormControl('',[Validators.required, Validators.email]),
    userType: new FormControl('', [Validators.required]),
    password: new FormControl('',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
    locationId: new FormControl(null, [Validators.required]),
    department: new FormControl(''),
    position: new FormControl('')
    
  });

  fullName: string = '';
  identificationNumber: number= 0;
  email: string = '';
  password: string = '';
  location: string = '';

  locations: any[] = [];

  showPassword: boolean = false;
  userTypeEnum = UserType;
  isLoading: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  handleRegister(){
    this.isLoading = true;
    console.log("register", this.registrationForm.value)
    const newUser: User = {
      fullName: this.registrationForm.get('fullName')?.value,
      nationalId: this.registrationForm.get('nationalId')?.value,
      email: this.registrationForm.get('email')?.value,
      password: this.registrationForm.get('password')?.value,
      location: {locationId: this.registrationForm.get('locationId')?.value},
      userType: this.registrationForm.get('userType')?.value,
      publicServant: this.isPublicServant() ? {
        department: this.registrationForm.get('department')?.value,
        position: this.registrationForm.get('position')?.value
      } : null  
    }
    console.log("new user", newUser);
    this.authService.register(newUser).subscribe({
      next:(response)=>{
        localStorage.setItem('token', response.token);
        //localStorage.setItem('user', JSON.stringify(newUser)); 
        console.log("Registration successful", response);
        const userId = response.userId;
        this.authService.getUserProfile(userId).subscribe();
      this.toastr.success("Registration successful! Please log in.", 'Success');
      this.isLoading = false;
      this.router.navigate(['/login']);
      },
    error: (err) => {
      console.error("Registration failed", err);
      this.toastr.error("Registration failed. Please try again.", 'Error');
      this.isLoading = false;
    }
    });
  }

  ngOnInit(): void {
    this.fetchLocations();
    
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

  get emailControl() {
    return this.registrationForm.get('email');
  }
  get passwordControl() {
    return this.registrationForm.get('password');
  }

  get locationIdControl(){
    return  this.registrationForm.get('locationId');
  }

  get userTypeControl(){
    return this.registrationForm.get('userType');
  }

  isPublicServant() {
    return this.registrationForm.get('userType')?.value === UserType.PUBLIC_SERVANT;
  }


}
