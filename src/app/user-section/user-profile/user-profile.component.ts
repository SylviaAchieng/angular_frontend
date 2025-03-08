import { Component } from '@angular/core';
import { UserSidebarComponent } from "./user-sidebar/user-sidebar.component";
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [UserSidebarComponent, CommonModule, RouterOutlet, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

}
