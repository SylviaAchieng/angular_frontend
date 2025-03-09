import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { DiscussionService } from '../../../services/discussion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-discussions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-discussions.component.html',
  styleUrl: './all-discussions.component.css'
})
export class AllDiscussionsComponent {

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
  
  
          newDiscussion: any = {
            title: '',
            category: '',
            startedBy: '',
            createdAt: '',
            description: ''
          };
    
          errorMessage: string = '';
    route: any;
        
        
          constructor(private authService: AuthService, public dialog: MatDialog, private toastr: ToastrService, private discussionService: DiscussionService) {}
        
        
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
        
          handleAddDiscussion(){
            this.discussionService.createDiscussion(this.newDiscussion.value).subscribe({
              next:(response)=>{
                this.toastr.success("Discussion created successfully!", "Success");
              },
            error: (err) => {
              console.error("failed", err);
              this.toastr.error("Failed to create a discussion. Please try again.", "Error"); 
            }
            });
          }
    
          handleUpdateUser() {
            this.authService.updateUser(this.selectedDiscussion.userId, this.selectedDiscussion).subscribe({
              next: (response) => {
                this.toastr.success("User updated successfully!", 'Success');
                 this.closeViewEventModal();
              },
              error: (error) => {
                console.error("Error updating user:", error);
                this.toastr.error("Failed to update user.", 'Error');
              }
            });
          }  
          
          handleDeleteUser(userId: any): void {
            if (confirm('Are you sure you want to delete this user?')) {
              this.authService.deleteUser(this.selectedDiscussion.userId).subscribe({
                next: () => {
                  console.log(`User with ID ${userId} deleted successfully`);
                  this.toastr.success("User deleted successfully!", 'Success');
                  this.users = this.users.filter((user: any) => user.userId !== userId);
                },
                error: (err) => {
                  console.error('Error deleting user:', err);
                  this.toastr.error("Failed to delete user. Please try again.", "Error"); 
                }
              });
            }
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
            // this.vipPrice = event.ticketTypes.find(t => t.type === 'VIP')?.price || null;
            // this.regularPrice = event.ticketTypes.find(t => t.type === 'Regular')?.price || null;
            // this.totalTickets = event.ticketTypes.reduce((total, t) => total + t.quantity, 0) || null;
            this.isViewing = true;
          }
        
          closeViewEventModal(): void {
            this.isViewing = false;
            this.selectedDiscussion = null;
            this.vipPrice = 0;
            this.regularPrice = 0;
            this.totalTickets = 0;
          }
}
