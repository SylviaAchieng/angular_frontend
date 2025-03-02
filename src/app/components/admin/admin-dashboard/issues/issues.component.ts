import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IssueService } from '../../../../services/issue.service';
import { LocationService } from '../../../../services/location.service';

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
      if (!this.newIssue.title || !this.newIssue.description) {
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
        },
        error: (error) => {
          console.error('Error creating issue:', error);
          this.toastr.error("Failed to create issue. Please try again.", "Error"); 
        }
      });
    }

  }

