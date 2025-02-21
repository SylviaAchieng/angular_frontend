import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LocationService } from '../../services/location.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NavbarComponent, RouterLink, ReactiveFormsModule, FormsModule, CommonModule],
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
    password: new FormControl('',[Validators.required, Validators.minLength(8)]),
    location: new FormGroup({
      locationId: new FormControl(null, [Validators.required])
    })
  });

  fullName: string = '';
  identificationNumber: number= 0;
  email: string = '';
  password: string = '';
  location: string = '';

  locations: any[] = [];


  handleRegister(){
    console.log("register", this.registrationForm.value)
    this.authService.register(this.registrationForm.value).subscribe({
      next:(response)=>{
        localStorage.setItem('token', response.token);
        const userId = response.userId;
        this.authService.getUserProfile(userId).subscribe();
        // Show success alert
      this.toastr.success("Registration successful! Please log in.", 'Success');
      this.router.navigate(['/login']);
      },
    error: (err) => {
      console.error("Registration failed", err);
      this.toastr.error("Registration failed. Please try again.", 'Error');
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


}
