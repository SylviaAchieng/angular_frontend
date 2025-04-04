import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-confirmation',
  standalone: true,
  imports: [],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.css'
})
export class EmailConfirmationComponent {
  userData : any;


  
  constructor(private router: Router) {}

  ngOnInit(): void{
    this.getUserIdFromLocalStorage();
  }

  getUserIdFromLocalStorage(){
    const userData = localStorage.getItem('user'); 
    if (userData) {
      this.userData = JSON.parse(userData);
    } else {
      this.userData = {}; // Default value if there's no data
    }
    console.log("siderbar userdata: ", userData)
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData); // Parse JSON string
      } catch (error) {
        console.error('Error parsing user data:', error);
        //return null;
      }
    }
    //return null;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
