import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactUsService } from '../../../../services/contact-us.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {


  chats: any[] = [];
  selectedMessage: any = null;
  isViewing = false;
  isAddMessageFormVisible = false;
  newMessage = {
    fullName: '', // Add fullName property
    email: '',
    message: '',
    location: { locationId: '' },
    userType: null
  }
  

  constructor(
    private contactUsService: ContactUsService,
    private toastr: ToastrService
  ){}

  ngOnInit() : void{
    this.fetchMessages()
  }

  toggleAddUserForm() {
    this.isAddMessageFormVisible = !this.isAddMessageFormVisible;
  }

  fetchMessages(): void {
    this.contactUsService.getAllMessages().subscribe((response) => {
      console.log("user message received:", response); // Debugging
      this.chats = response._embedded || [];
    });

    // Subscribe to projectSubject to update component state
  this.contactUsService.contactSubject.subscribe((state) => {
    this.chats = state.users;
    console.log("users state updated:", this.chats);
  });
  }

  toggleEventVisibility(user: any): void {
    user.isDeleted = !user.isDeleted;
  }

  showViewEventModal(user: any): void {
    this.selectedMessage = user;
    this.isViewing = true;
  }

  closeViewEventModal(): void {
    this.isViewing = false;
    this.selectedMessage = null;
  }
}
