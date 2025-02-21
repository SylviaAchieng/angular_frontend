import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  user:any = null;
    username: any;
  
    constructor(
      private authService: AuthService
    ){}
  
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

}
