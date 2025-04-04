import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,NavbarComponent, RouterLink, MatProgressSpinnerModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService){}

  isLoading: boolean = false;
  showPassword: boolean = false;
  

  loginForm = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)])
    })

  // email: string = '';
  // password: string = '';
  errorMessage = '';
  passwordVisible: boolean = false;
  rememberMe: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.toastr.error("Please enter valid credentials", "Error");
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    const email = this.loginForm.get('email')?.value as string;
    const password = this.loginForm.get('password')?.value as string;
    this.authService.login(email, password).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        this.toastr.success("Login successful!", "Success");
  
        // Store login response details
        localStorage.setItem('token', response._embedded.token);
        localStorage.setItem('userId', response._embedded.user.userId);
        localStorage.setItem('userType', response._embedded.user.userType);
        localStorage.setItem('user', JSON.stringify(response._embedded.user))
        
        this.isLoading = false;
  
        const userId = response._embedded.user.userId;
        const userType = response._embedded.user.userType;
  
        // Fetch user profile after login
        this.authService.getUserProfile(userId).subscribe({
          next: (profileResponse: any) => {
            console.log('User profile retrieved:', profileResponse);

            const fullName = profileResponse._embedded.fullName;
            localStorage.setItem('fullName', fullName);
                    
            // Navigate based on user type
            if (userType === 'ADMIN') {
              this.router.navigate(['/admin-dashboard']);
            } else if (userType === 'PUBLIC_SERVANT') {
              this.router.navigate(['/public-servant']);
            } else {
              this.router.navigate(['/profile']); // Default home page for all users
            }
          },
          error: (profileError) => {
            console.error('Failed to fetch user profile:', profileError);
          }
        });
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = 'Invalid email or password';
        this.toastr.error("Invalid email or password. Please try again.", "Error");
        this.isLoading = false; 
      }
    });
  }

  get emailControl() {
    return this.loginForm.get('email');
  }
  get passwordControl() {
    return this.loginForm.get('password');
  }

}
