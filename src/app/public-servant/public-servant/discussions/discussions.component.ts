import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { DiscussionService } from '../../../services/discussion.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-discussions',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './discussions.component.html',
  styleUrl: './discussions.component.css'
})
export class DiscussionsComponent {
  @Input() discussion: any;
        @Output() deleteUserEvent = new EventEmitter<number>();
      
        discussions: any[]=[];
          users: any;
          paginatedEvents: any[] = [];
          selectedDiscussion: any = null;
          isViewing = false;
          currentPage = 1;
          visiblePages: number[] = [];
          vipPrice: number = 0;
          regularPrice: number=0;
          totalTickets: number=0;
          itemsPerPage: number=5;
          isDeleted: boolean=false;
          isAddUserFormVisible = false;
  
  
          newDiscussion = {
            title: '',
            category: '',
            startedBy: {fullName: ''},
            description: '',
          };
    
          errorMessage: string = '';
          route: any;
        
        
          constructor(
            private authService: AuthService, 
            public dialog: MatDialog, 
            private toastr: ToastrService, 
            private discussionService: DiscussionService
          ) {}
        
        
           ngOnInit(): void {
             this.getAllDiscussions();
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
  
           getAllDiscussions() {
            this.discussionService.getAllDiscussions().subscribe({
              next: (response: any) => {
                this.discussions = response._embedded || [];
              },
              error: err => console.error('Error fetching discussions:', err)
            });
          }
  
  
          onSubmit(){
            if (!this.newDiscussion.title || !this.newDiscussion.description || !this.newDiscussion.category) {
              this.toastr.info('Please fill in all required fields, including an image.', 'Info');
              return;
            }
            const data = {
              ...this.newDiscussion
            };
            this.discussionService.createDiscussion(data).subscribe({
              next:(response)=>{
                this.toastr.success("Discussion created successfully!", "Success");
              },
            error: (err) => {
              console.error("failed", err);
              this.toastr.error("Failed to create a discussion. Please try again.", "Error"); 
            }
            });
          }

          updateDiscussion() {
            if (!this.selectedDiscussion || !this.selectedDiscussion.discussionId) {
              this.toastr.info('Please select a discussion to update.', 'Info');
              return;
            }
            const imageData = this.selectedDiscussion.base64EncodedImage.startsWith("data:image/")
              ? this.selectedDiscussion.base64EncodedImage.split(",")[1]
              : this.selectedDiscussion.base64EncodedImage;
        
            const updatedDiscussionData = {
              ...this.selectedDiscussion,
              base64EncodedImage: imageData  // Send only the Base64 string
            };
            this.discussionService.updateDiscussion(updatedDiscussionData).subscribe({
              next: (updatedDiscussion) => {
                console.log('Discussion updated successfully:', updatedDiscussion);
                this.discussions = this.discussions.map((discussion: any) =>
                  discussion.discussionId === updatedDiscussion.discussionId ? updatedDiscussion : discussion
                );
        
                this.toastr.success("Discussion updated successfully!", "Success");
              },
              error: (error) => {
                console.error('Error updating Discussion:', error);
                this.toastr.error("Failed to update discussion. Please try again.", "Error");
              }
            });
          }
    
            
          deleteDiscussion() {
            if (!this.selectedDiscussion || !this.selectedDiscussion.discussionId) {
              this.toastr.info('Please select a discussion to delete.', 'Info');
              return;
            }
            const discussionId = this.selectedDiscussion.discussionId; // Extract only the ID
            this.discussionService.deleteDiscussion(discussionId).subscribe({
              next: () => {
                console.log('discussion deleted successfully:', discussionId);
                this.discussions = this.discussions.filter((discussion: any) => discussion.discussionId !== discussionId);
                this.toastr.success("discussion deleted successfully!", "Success"); // Show success message
              },
              error: (error) => {
                console.error('Error deleting discussion:', error);
                this.toastr.error("Failed to delete discussion. Please try again.", "Error"); 
              }
            });
          }
          
          
          toggleAddUserForm() {
            this.isAddUserFormVisible = !this.isAddUserFormVisible;
          }
    
          
        
          updatePagination(): void {
            const totalPages = Math.ceil(this.users.length / this.itemsPerPage);
            this.visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);
            this.setPage(this.currentPage);
          }
        
          setPage(page: number): void {
            if (page < 1 || page > this.visiblePages.length) return;
            this.currentPage = page;
            const startIndex = (page - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            this.paginatedEvents = this.users.slice(startIndex, endIndex);
          }
        
          previousPage(): void {
            if (this.currentPage > 1) {
              this.setPage(this.currentPage - 1);
            }
          }
        
          nextPage(): void {
            if (this.currentPage < this.visiblePages.length) {
              this.setPage(this.currentPage + 1);
            }
          }
        
          toggleEventVisibility(user: any): void {
            user.isDeleted = !user.isDeleted;
          }
        
          showViewEventModal(user: any): void {
            this.selectedDiscussion = user;
            this.isViewing = true;
          }
        
          closeViewEventModal(): void {
            this.isViewing = false;
            this.selectedDiscussion = null;
          }

}
