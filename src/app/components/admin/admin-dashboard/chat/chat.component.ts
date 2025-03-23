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
  // chat = [
  //   { id: 1, avatar: 'https://randomuser.me/api/portraits/men/1.jpg', title: 'Air Ticket to New York', message: 'I need a ticket...', date: 'Dec 12' },
  //   { id: 2, avatar: 'https://randomuser.me/api/portraits/men/2.jpg', title: 'Holiday gift for my brother', message: 'I am looking for...', date: 'Dec 10' },
  //   { id: 3, avatar: 'https://randomuser.me/api/portraits/men/3.jpg', title: 'Christmas gift for my mom', message: 'I want a gift for...', date: 'Dec 11' }
  // ];

  // messages: { chatId: number; text: string; fromMe: boolean; time: string }[] = [
  //   { chatId: 3, text: 'Hi, Janice here. How can I help?', fromMe: false, time: '4:15 PM' },
  //   { chatId: 3, text: 'I am looking for a Christmas gift for my mom.', fromMe: true, time: '4:16 PM' },
  //   { chatId: 3, text: 'May I know your budget?', fromMe: false, time: '4:17 PM' },
  //   { chatId: 3, text: 'Around $50-$100.', fromMe: true, time: '4:20 PM' }
  // ];

  // selectedChat: any = null;
  // chatMessages: { chatId: number; text: string; fromMe: boolean; time: string }[] = []; // Explicitly define type
  // newMessage = '';

  // selectChat(chat: any) {
  //   this.selectedChat = chat;
  //   this.chatMessages = this.messages.filter(msg => msg.chatId === chat.id);
  // }

  // sendMessage() {
  //   if (this.newMessage.trim() !== '' && this.selectedChat) {
  //     this.chatMessages.push({
  //       chatId: this.selectedChat.id,
  //       text: this.newMessage,
  //       fromMe: true,
  //       time: new Date().toLocaleTimeString()
  //     });
  //     this.newMessage = '';
  //   }
  // }

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
