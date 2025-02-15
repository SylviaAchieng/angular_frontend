import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { DiscussionService } from '../../services/discussion.service';
import { ReplyService } from '../../services/reply.service';

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

  loggedInUserId = localStorage.getItem('userId');



  constructor(private route: ActivatedRoute, private router: Router, private discussionService: DiscussionService, private replyService: ReplyService) {}

  ngOnInit() {
    const discussionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDiscussionDetails();
    this.loadReplies(discussionId);
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
      alert('User or discussion information is missing.');
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
  
        alert('Reply sent successfully!');
      },
      error: (err) => {
        console.error('Error sending reply:', err);
        alert('Failed to send reply. Please try again.');
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
        alert("Reply deleted successfully!");
      },
      error: (err) => {
        console.error("Error deleting reply:", err);
        alert("Failed to delete reply. You can only delete your own replies.");
      }
    });
  }
  
  

}
