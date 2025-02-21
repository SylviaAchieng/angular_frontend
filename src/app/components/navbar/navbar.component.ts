import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private router: Router, public authService: AuthService) {}

  user:any = null;
  username: any;
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('fullName');
    console.log('Retrieved Username:', this.username);
    const userId = localStorage.getItem('userId');
    this.authService.authSubject.subscribe(
      (auth)=>{
        console.log("auth state", auth)
        this.user = auth.user;
      }
    )
  }

  logout(){
    this.authService.logout();
  }

}
