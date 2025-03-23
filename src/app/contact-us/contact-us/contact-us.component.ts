import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { LocationService } from '../../services/location.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactUsService } from '../../services/contact-us.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

enum UserType {
  CITIZEN = 'CITIZEN',
  PUBLIC_SERVANT = 'PUBLIC_SERVANT'
}

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule,FormsModule, RouterLink],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  locations: any[] = [];
  userTypeEnum = UserType;
  newMessage = {
    fullName: '',
    email: '',
    message: '',
    location: { locationId: '' },
    userType:null
  };

  clearForm(){
    this.newMessage.email = '';
    this.newMessage.fullName = '';
    this.newMessage.message = '';
    this.newMessage.location.locationId = '';
    this.newMessage.userType = null;
  }

  constructor(
    private locationService: LocationService,
    private contactUsService: ContactUsService,
    private toastr: ToastrService
  ){}

  ngOnInit() : void{
    this.fetchLocations()
  }

  fetchLocations(): void {
    this.locationService.getAllLocations().subscribe((response) => {
      this.locations = response._embedded || [];
    });
  this.locationService.locationSubject.subscribe((state) => {
    this.locations = state.locations;
    console.log("location state updated:", this.locations);
  });
  }

  sendMessage() {
    if (!this.newMessage.fullName || !this.newMessage.email || !this.newMessage.message || !this.newMessage.location.locationId || !this.newMessage.userType) {
      this.toastr.info('Please fill in all required fields.', 'Info');
      return;
    }
    console.log('Sending message:', this.newMessage);
    this.contactUsService.createMessage(this.newMessage).subscribe({
      next: (response) => {
        console.log('Message sent successfully:', response);
        this.toastr.success('Message sent successfully!', 'Success');
        // Reset the form
        this.newMessage = { 
          fullName: '', 
          email: '', 
          message: '', 
          location: { locationId: '' }, 
          userType: null 
        };
        this.clearForm();
      },
      error: (error) => {
        console.error('Error sending message:', error);
        this.toastr.error('Failed to send message. Please try again.', 'Error');
      }
    });
  }
  

}
