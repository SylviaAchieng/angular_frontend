import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,NavbarComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  onSubmit() {
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    console.log('Remember Me:', this.rememberMe);
  }

}
