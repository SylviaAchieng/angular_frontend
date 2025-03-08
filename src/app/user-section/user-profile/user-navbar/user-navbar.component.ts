import { Component } from '@angular/core';

@Component({
  selector: 'app-user-navbar',
  standalone: true,
  imports: [],
  templateUrl: './user-navbar.component.html',
  styleUrl: './user-navbar.component.css'
})
export class UserNavbarComponent {
  user = {
    name: 'Miranda',
    role: 'Citizen',
    avatar: 'assests/avatar.jpg',
    online: true
  };

}
