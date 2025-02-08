import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProjectFormComponent } from '../../../../pages/update-project-form/update-project-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

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
    
    
      constructor(private authService: AuthService, public dialog: MatDialog) {}
    
    
       ngOnInit(): void {
         this.loadEvents();
       }
    
       loadEvents(): void {
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
  
      handleDeleteUser(userId: number){
        this.authService.deleteUser(this.user.userId).subscribe();
      }

      handleUpdateUser() {
        this.authService.updateUser(this.selectedUser.userId, this.selectedUser).subscribe({
          next: (response) => {
            alert("User updated successfully!");
             this.closeViewEventModal();
          },
          error: (error) => {
            console.error("Error updating user:", error);
            alert("Failed to update user.");
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
