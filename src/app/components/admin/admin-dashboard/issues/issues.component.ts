import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IssueService } from '../../../../services/issue.service';
import { LocationService } from '../../../../services/location.service';

enum IssueStatusEnum {
  CREATED = 'CREATED',
  PENDING = 'PENDING',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED',
  PARKED = 'PARKED'
}

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './issues.component.html',
  styleUrl: './issues.component.css'
})
export class IssuesComponent {

  issues: any[] = [];
  locations: any[] = [];
    selectedIssue: any = null;
    isViewing = false;
    isDeleted: boolean = false;
  
    isIssueFormVisible = false;
    issuesStatus = IssueStatusEnum;

    statuses: string[] = ['CREATED','PENDING','PARKED','CANCELLED', 'RESOLVED'];

  
    newIssue = {
      title: '',
      createdAt: '',
      status: '',
      description: '',
      location: { locationId: '' },
      base64EncodedImage: '' // Stores encoded image
    };

    newIssues = {
      title: '',
      //createdAt: '',
      description: '',
      location: { locationId: '' },
      base64EncodedImage: '',
      status: null
    };
  
  
  
    constructor( private toastr: ToastrService, private issueService: IssueService, private locationService:LocationService) { }
  
  
    ngOnInit(): void {
      this.getAllIssues();
      this.fetchLocations();
    }
  
    
  
    toggleIssueForm() {
      this.isIssueFormVisible = !this.isIssueFormVisible;
    }
  
    // Handle image upload
    onImageUpload(issue: any) {
      const file = issue.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.newIssue.base64EncodedImage = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  
    // Clear selected image
    clearImage() {
      this.newIssue.base64EncodedImage = '';
    }
    
  
    toggleIssueVisibility(issue: any): void {
      issue.isDeleted = !issue.isDeleted;
    }
  
    showViewIssueModal(event: any): void {
      this.selectedIssue = event;
      this.isViewing = true;
    }
  
    closeViewIssueModal(): void {
      this.isViewing = false;
      this.selectedIssue = null;
    }

    fetchLocations(): void {
      this.locationService.getAllLocations().subscribe((response) => {
        this.locations = response._embedded || [];
      });
    this.locationService.locationSubject.subscribe((state) => {
      this.locations = state.locations;
      console.log("location state updated:", this.locations);
    });
    }

    getAllIssues(): void {
      this.issueService.getAllIssues().subscribe({
        next: (response: any) => {
          console.log("issues retrieved successfully:", response);
    
          if (!response || !response._embedded) {
            console.error("Invalid response format");
            return;
          }
          const formattedIssues = response._embedded.map((issue: any) => ({
            ...issue,
            base64EncodedImage: issue.base64EncodedImage?.startsWith("data:image/")
              ? issue.base64EncodedImage  // Already formatted correctly
              : `data:image/jpeg;base64,${issue.base64EncodedImage}`  // Add prefix only if missing
          }));
          this.issueService.issueSubject.next({ issues: formattedIssues });
        },
        error: (err) => {
          console.error("Failed to load projects:", err);
        }
      });
      this.issueService.issueSubject.subscribe((state: any) => {
        this.issues = state.issues;
        console.log("Projects state updated with images:", this.issues);
      });
    }

    submitIssue() {
      if (!this.newIssue.title || !this.newIssue.description || !this.newIssue.base64EncodedImage) {
        this.toastr.info('Please fill in all required fields, including an image.', 'Info');
        return;
      }
    
      const imageData = this.newIssue.base64EncodedImage.startsWith("data:image/")
        ? this.newIssue.base64EncodedImage.split(",")[1]
        : this.newIssue.base64EncodedImage;
    
      // Retrieve userId from localStorage
      const userId = localStorage.getItem('userId');
    
      if (!userId) {
        this.toastr.error('User not authenticated.', 'Error');
        return;
      }
    
      const issueData = {
        ...this.newIssue,
        status: null,
        user: { userId: userId ? parseInt(userId, 10) : null }, // Include the logged-in user ID
        base64EncodedImage: imageData  
      };
  
      console.log("issueData", issueData);
      this.issueService.createIssue(issueData).subscribe({
        next: (newIssue) => {
          console.log('Issue created successfully', newIssue);
          this.toastr.success('Issue created successfully!', 'Success');
          // Reset the form
          this.newIssues = {  
            title: '',
            description: '',
            location: { locationId: '' },
            base64EncodedImage: '',
            status: null
          };
          this.toggleIssueForm();
          this.getAllIssues();
          
          
        },
        error: (error) => {
          console.error('Error creating issue:', error);
          this.toastr.error("Failed to create issue. Please try again.", "Error"); 
        }
      });
    }

    updateIssue() {
      if (!this.selectedIssue || !this.selectedIssue.issueId) {
        this.toastr.info('Please select a issue to update.', 'Info');
        return;
      }
      const imageData = this.selectedIssue.base64EncodedImage.startsWith("data:image/")
        ? this.selectedIssue.base64EncodedImage.split(",")[1]
        : this.selectedIssue.base64EncodedImage;
  
      const updatedIssueData = {
        ...this.selectedIssue,
        base64EncodedImage: imageData  // Send only the Base64 string
      };
      this.issueService.updateIssue(updatedIssueData).subscribe({
        next: (updatedIssue) => {
          console.log('issue updated successfully:', updatedIssue);
          this.issues = this.issues.map((issue: any) =>
            issue.issueId === updatedIssue.issueId ? updatedIssue : issue
          );
  
          this.toastr.success("Issue updated successfully!", "Success");
        },
        error: (error) => {
          console.error('Error updating issue:', error);
          this.toastr.error("Failed to update a issue. Please try again.", "Error");
        }
      });
    }

    deleteIssue() {
      if (!this.selectedIssue || !this.selectedIssue.issueId) {
        this.toastr.info('Please select a issue to delete.', 'Info');
        return;
      }
    
      const issueId = this.selectedIssue.issueId; // Extract only the ID
    
      this.issueService.deleteIssue(issueId).subscribe({
        next: () => {
          console.log('issue deleted successfully:', issueId);
    
          this.issues = this.issues.filter((issue: any) => issue.issueId !== issueId);
    
          this.toastr.success("issue deleted successfully!", "Success"); // Show success message
          this.closeViewIssueModal(); // Close the modal
        },
        error: (error) => {
          console.error('Error deleting issue:', error);
          this.toastr.error("Failed to delete issue. Please try again.", "Error"); 
        }
      });
    }

  }

