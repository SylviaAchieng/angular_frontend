import { Component } from '@angular/core';
import { IssueService } from '../../../services/issue.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../../services/location.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-issue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-issue.component.html',
  styleUrl: './report-issue.component.css'
})
export class ReportIssueComponent {

  constructor(
    private issueService: IssueService,
    private toastr: ToastrService,
    private locationService: LocationService,
    private router: Router
  ){}

  locations: any[] = [];
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
    status: null,
    base64EncodedImage: '' // Stores encoded image
  };

  ngOnInit(): void {
    this.fetchLocations();
    
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
  

  toggleIssueForm() {
    this.newIssue.title= '';
    this.newIssue.createdAt= '';
    this.newIssue.description= '';
    this.newIssue.location= { locationId: '' };
    this.newIssue.base64EncodedImage= '';
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
        this.router.navigate(['/profile']);
        //this.toggleIssueForm();
        
      },
      error: (error) => {
        console.error('Error creating issue:', error);
        this.toastr.error("Failed to create issue. Please try again.", "Error"); 
      }
    });
  }

}
