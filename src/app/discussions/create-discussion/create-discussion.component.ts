import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";
import { DiscussionService } from '../../services/discussion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-discussion',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './create-discussion.component.html',
  styleUrl: './create-discussion.component.css'
})
export class CreateDiscussionComponent {

  constructor(private discussionService: DiscussionService, private router: Router, private toastr: ToastrService){}

  discussionForm=new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      user: new FormGroup({
        fullName: new FormControl(null, [Validators.required])
      })
    });

    onSubmit(){
      this.discussionService.createDiscussion(this.discussionForm.value).subscribe({
        next:(response)=>{
          this.toastr.success("Discussion created successfully!", "Success");
          this.router.navigate(['/discussion']);
        },
      error: (err) => {
        console.error("failed", err);
        this.toastr.error("Failed to create a discussion. Please try again.", "Error"); 
      }
      });
    }

    handleCancel(){
      this.router.navigate(['/discussion']);
    }

    chats = [
      { id: 1, avatar: 'https://randomuser.me/api/portraits/men/1.jpg', title: 'Air Ticket to New York', message: 'I need a ticket...', date: 'Dec 12' },
      { id: 2, avatar: 'https://randomuser.me/api/portraits/men/2.jpg', title: 'Holiday gift for my brother', message: 'I am looking for...', date: 'Dec 10' },
      { id: 3, avatar: 'https://randomuser.me/api/portraits/men/3.jpg', title: 'Christmas gift for my mom', message: 'I want a gift for...', date: 'Dec 11' }
    ];
  
    messages: { chatId: number; text: string; fromMe: boolean; time: string }[] = [
      { chatId: 3, text: 'Hi, Janice here. How can I help?', fromMe: false, time: '4:15 PM' },
      { chatId: 3, text: 'I am looking for a Christmas gift for my mom.', fromMe: true, time: '4:16 PM' },
      { chatId: 3, text: 'May I know your budget?', fromMe: false, time: '4:17 PM' },
      { chatId: 3, text: 'Around $50-$100.', fromMe: true, time: '4:20 PM' }
    ];
  
    selectedChat: any = null;
    chatMessages: { chatId: number; text: string; fromMe: boolean; time: string }[] = []; // Explicitly define type
    newMessage = '';
  
    selectChat(chat: any) {
      this.selectedChat = chat;
      this.chatMessages = this.messages.filter(msg => msg.chatId === chat.id);
    }
  
    sendMessage() {
      if (this.newMessage.trim() !== '' && this.selectedChat) {
        this.chatMessages.push({
          chatId: this.selectedChat.id,
          text: this.newMessage,
          fromMe: true,
          time: new Date().toLocaleTimeString()
        });
        this.newMessage = '';
      }
    }

    

}
