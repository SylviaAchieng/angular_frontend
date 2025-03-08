import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.css'
})
export class MessagingComponent {
  isTyping = false;

  messages = [
    {
      sender: 'user',
      content: 'What is Lorem ipsum dummy text?',
      timestamp: '4:30 am'
    },
    {
      sender: 'admin',
      content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown specimen book.',
      timestamp: '4:33 am'
    },
    {
      sender: 'user',
      content: 'Where does it come from?',
      timestamp: '4:40 am'
    },
    {
      sender: 'admin',
      content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown specimen book.',
      timestamp: '5:03 am'
    },
    {
      sender: 'user',
      content: 'Where does it come from?',
      timestamp: '5:10 am'
    }
  ];

  newMessage = '';

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({
        sender: 'user',
        content: this.newMessage,
        timestamp: new Date().toLocaleTimeString()
      });
      this.newMessage = '';
    }
  }
  

}
