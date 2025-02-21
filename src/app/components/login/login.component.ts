import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,NavbarComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService){}

  loginForm = new FormGroup({
      email: new FormControl('',[Validators.required, Validators.email]),
      password: new FormControl('',[Validators.required])
    })

  email: string = '';
  password: string = '';
  errorMessage = '';
  passwordVisible: boolean = false;
  rememberMe: boolean = false;

  onSubmit() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('Remember Me:', this.rememberMe);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        this.toastr.success("Login successful!", "Success");
  
        // Store login response details
        localStorage.setItem('token', response._embedded.token);
        localStorage.setItem('userId', response._embedded.user.userId);
        localStorage.setItem('userType', response._embedded.user.userType);
        localStorage.setItem('user', JSON.stringify(response._embedded.user))
        
  
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
              this.router.navigate(['/']); // Default home page for all users
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
      }
    });
  }

}
