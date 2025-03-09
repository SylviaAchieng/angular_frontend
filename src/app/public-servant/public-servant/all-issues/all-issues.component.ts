import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../../../services/project.service';
import { IssueService } from '../../../services/issue.service';
import { EventService } from '../../../services/event.service';
import { LocationService } from '../../../services/location.service';

@Component({
  selector: 'app-all-issues',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-issues.component.html',
  styleUrl: './all-issues.component.css'
})
export class AllIssuesComponent {

  issues: any[] = [];
  paginatedEvents: any[] = [];
  selectedEvent: any = null;
  selectedIssue: any = null;
  isViewing = false;
  isDeleted: boolean = false;

  isIssueFormVisible = false;
  locations: any[] = [];

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
    base64EncodedImage: '' // Stores encoded image
  };



  constructor(private toastr: ToastrService, private issueService: IssueService, private locationService: LocationService) { }


  ngOnInit(): void {
    this.fetchLocations();
    this.loadIssues();
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
      user: { userId: userId ? parseInt(userId, 10) : null }, // Include the logged-in user ID
      base64EncodedImage: imageData  
    };
  
    this.issueService.createIssue(issueData).subscribe({
      next: (newIssue) => {
        console.log('Issue created successfully', newIssue);
        this.toastr.success('Issue created successfully!', 'Success');
        // Reset the form
        this.newIssues = {  
          title: '',
          description: '',
          location: { locationId: '' },
          base64EncodedImage: ''
        };
        this.loadIssues();
        this.isIssueFormVisible = false;
      },
      error: (error) => {
        console.error('Error creating issue:', error);
        this.toastr.error("Failed to create issue. Please try again.", "Error"); 
      }
    });
  }

  loadIssues(): void {
    const userString = localStorage.getItem('user');

    if (!userString) {
      console.warn("No user found in local storage.");
      return;
    }

    const user = JSON.parse(userString);
    const locationId = user.location?.locationId;

    if (!locationId) {
      console.warn("No location ID found for logged-in user.");
      return;
    }

    this.issueService.getIssueByLocationId(locationId).subscribe({
      next: (response: any) => {
        console.log("issues received:", response);

        this.issues = response._embedded?.map((issue: any) => ({
          ...issue,
          base64EncodedImage: issue.base64EncodedImage
            ? `data:image/jpg;base64,${issue.base64EncodedImage}`
            : null
        })) || [];

        console.log("Formatted issues:", this.issues);
      },
      error: (error) => {
        console.error("Error fetching issues:", error);
      }
    });
  }



  updateIssue() {
    if (!this.selectedIssue || !this.selectedIssue.issueId) {
      this.toastr.info('Please select a project to update.', 'Info');
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
          issue.issueId === updatedIssue.projectId ? updatedIssue : issue
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
}
