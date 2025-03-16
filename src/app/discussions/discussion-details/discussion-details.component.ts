import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { DiscussionService } from '../../services/discussion.service';
import { ReplyService } from '../../services/reply.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-discussion-details',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FooterComponent, FormsModule],
  templateUrl: './discussion-details.component.html',
  styleUrl: './discussion-details.component.css'
})
export class DiscussionDetailsComponent {

  @Input() discussion: any;
  newReply: string = ''; 
  replies: any[] = [];
  taggedReplyId: number | null = null;
  taggedReplyUser: string | null = null;

  loggedInUserId = localStorage.getItem('userId');



  constructor(private route: ActivatedRoute, private router: Router, private discussionService: DiscussionService, private replyService: ReplyService, private toastr: ToastrService) {}

  ngOnInit() {
    const discussionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDiscussionDetails();
    this.loadReplies(discussionId);
    this.loggedInUserId=localStorage.getItem('userId');
  }

  goBack() {
    this.router.navigate(['/discussion']);
  }

  loadReplies(discussionId: number) {
    this.replyService.getAllReplys(discussionId).subscribe({
      next: (response) => {
        this.replies = response._embedded || []; // Ensure it’s an array
      },
      error: (err) => {
        console.error('Error fetching replies:', err);
      }
    });
  }

  submitReply() {
    if (!this.newReply.trim()) return; // Prevent empty replies
  
    const userId = localStorage.getItem('userId'); // Assuming you store user ID in localStorage
    if (!userId || !this.discussion?.discussionId) {
      this.toastr.info("Discussion not found. Please try again.", "Info"); 
      return;
    }
    const replyData = {
      comment: this.newReply,
      user: { userId: parseInt(userId) },
      discussion: { discussionId: this.discussion.discussionId }
    };
    this.replyService.createReply(replyData).subscribe({
      next: (newReply) => {
        if (!this.discussion.replies) {
          this.discussion.replies = [];
        }
        this.discussion.replies.unshift(newReply);
        this.discussion.replyCount++; 
        this.newReply = ''; 
        this.toastr.success("Reply sent successfully!", "Success");
        this.loadReplies(this.discussion.discussionId);
      },
      error: (err) => {
        console.error('Error sending reply:', err);
        this.toastr.error("Failed to send a reply. Please try again.", "Error"); 
      }
    });
  }
  

  loadDiscussionDetails(): void {
    const discussionId = this.route.snapshot.paramMap.get('id');
    const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage

    if (discussionId && userId) {
      this.discussionService.getDiscussionById(discussionId).subscribe({
        next: (response) => {
          console.log('Discussion Details:', response);
          this.discussion = response?._embedded ?? response; // Simplified null check
        },
        error: (error) => {
          console.error('Error fetching discussion details', error);
        }
      });
    } else {
      console.error('Missing discussion ID or user ID.');
    }
}


  deleteReply(commentId: number) {
    if (!confirm("Are you sure you want to delete this reply?")) return;
  
    this.replyService.deleteReply(commentId).subscribe({
      next: () => {
        this.discussion.replies = this.discussion.replies.filter((r: any) => r.id !== commentId);
        this.discussion.replyCount--; 
        this.toastr.success("Reply deleted successfully!", 'Success');
      },
      error: (err) => {
        console.error("Error deleting reply:", err);
        this.toastr.error("Failed to delete reply. You can only delete your own replies.", 'Error');
      }
    });
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
