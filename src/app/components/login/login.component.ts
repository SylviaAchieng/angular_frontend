import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,NavbarComponent, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private authService: AuthService, private router: Router){}

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
        localStorage.setItem('token', response._embedded.token);
        localStorage.setItem('userId', response._embedded.user.userId);
        localStorage.setItem('username', response._embedded.user.fullName);
        const userId = response._embedded.user.userId;
        this.authService.getUserProfile(userId).subscribe();
        console.log("login successful", response)
        this.router.navigate(['/']); // Replace with your desired route
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.errorMessage = 'Invalid email or password';
      }
    });
  }

  // signIn(){
  //   console.log("login", this.loginForm.value)
  //   this.authService.signin(this.loginForm.value).subscribe({
  //     next:(response)=>{
  //       localStorage.setItem('token', response.token);
  //       const userId = response.userId; // Assuming the response contains userId
  //       this.authService.getUserProfile(userId).subscribe();
  //       console.log("login successful", response)
  //     }
  //   });
  // }

}
