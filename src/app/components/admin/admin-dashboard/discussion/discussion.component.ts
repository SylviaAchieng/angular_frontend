import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-discussion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.css'
})
export class DiscussionComponent {

  @Input() user: any;
      @Output() deleteUserEvent = new EventEmitter<number>();
    
        users: any;
        paginatedEvents: any[] = [];
        selectedUser: any = null;
        isViewing = false;
        currentPage = 1;
        visiblePages: number[] = [];
        vipPrice: number = 0;
        regularPrice: number=0;
        totalTickets: number=0;
        itemsPerPage: number=5;
        isDeleted: boolean=false;
        isAddUserFormVisible = false;
  
        newUser: any = {
          fullName: '',
          email: '',
          idNumber: null,
          password: '',
          location: { county: '' },
          userType: ''
        };
  
        errorMessage: string = '';
      
      
        constructor(private authService: AuthService, public dialog: MatDialog, private toastr: ToastrService) {}
      
      
         ngOnInit(): void {
           this.loadUsers();
         }
      
         loadUsers(): void {
          this.authService.getAllUsers().subscribe((response) => {
            console.log("users received:", response); // Debugging
            this.users = response._embedded || [];
          });
      
          // Subscribe to projectSubject to update component state
        this.authService.authSubject.subscribe((state) => {
          this.users = state.users;
          console.log("users state updated:", this.users);
        });
        }
  
        handleUpdateUser() {
          this.authService.updateUser(this.selectedUser.userId, this.selectedUser).subscribe({
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
            this.authService.deleteUser(this.selectedUser.userId).subscribe({
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
  
        handleAddUser() {
          if (!this.newUser.fullName || !this.newUser.email || !this.newUser.password || !this.newUser.nationalId) {
            this.toastr.info('All fields are required', 'Info');
            return;
          }
          if (isNaN(this.newUser.nationalId)) {
            this.toastr.info('National ID must be a number', 'Info');
            return;
          }
          this.authService.register(this.newUser).subscribe({
            next: (response) => {
              console.log('User registered:', response);
              this.users.push({ ...this.newUser });
              this.toastr.success('User added successfully!', 'Success');
              this.newUser = { fullName: '', email: '', nationalId: null, password: '', location: { county: '' }, userType: '' };
              this.toggleAddUserForm();
            },
            error: (error) => {
              console.error('Error registering user:', error);
              this.toastr.error("Failed to create user. Please try again.", "Error"); 
            }
          });
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
          this.selectedUser = user;
          // this.vipPrice = event.ticketTypes.find(t => t.type === 'VIP')?.price || null;
          // this.regularPrice = event.ticketTypes.find(t => t.type === 'Regular')?.price || null;
          // this.totalTickets = event.ticketTypes.reduce((total, t) => total + t.quantity, 0) || null;
          this.isViewing = true;
        }
      
        closeViewEventModal(): void {
          this.isViewing = false;
          this.selectedUser = null;
          this.vipPrice = 0;
          this.regularPrice = 0;
          this.totalTickets = 0;
        }
}
