import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NavbarComponent, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  constructor(private authService: AuthService, private router: Router){}

  registrationForm=new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    identificationNumber: new FormControl('', [Validators.required]),
    email: new FormControl('',[Validators.required, Validators.email]),
    location: new FormControl('', [Validators.required]),
    password: new FormControl('',[Validators.required, Validators.minLength(8)])
  });

  fullName: string = '';
  identificationNumber: number= 0;
  email: string = '';
  password: string = '';
  location: string = '';


  handleRegister(){
    console.log("register", this.registrationForm.value)
    this.authService.register(this.registrationForm.value).subscribe({
      next:(response)=>{
        localStorage.setItem('token', response.token);
        const userId = response.userId;
        this.authService.getUserProfile(userId).subscribe();
        console.log("Signup successful", response)
      }
    });
  }

}
