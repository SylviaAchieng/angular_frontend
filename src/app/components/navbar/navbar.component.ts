import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private router: Router, public authService: AuthService) {}

  user:any = null;

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.authService.authSubject.subscribe(
      (auth)=>{
        console.log("auth state", auth)
        this.user = auth.user;
      }
    )
  }

}
