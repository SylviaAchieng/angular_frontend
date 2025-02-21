import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from "../../components/footer/footer.component";
import { LocationService } from '../../services/location.service';
import { IssueService } from '../../services/issue.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-issues-page',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './issues-page.component.html',
  styleUrl: './issues-page.component.css'
})
export class IssuesPageComponent {
  issue = { title: '', description: '', location:{locationId: ''}, image: '' };
  locations: any[] = [];
  previewImage: string | ArrayBuffer | null = null;

  newIssue = {
    title: '',
    //createdAt: '',
    description: '',
    location: { locationId: '' },
    base64EncodedImage: '' // Stores encoded image
  };

  constructor(
    private locationService: LocationService, 
    private issueService: IssueService,
    private toastr: ToastrService

  ) { }

  ngOnInit(): void {
    this.fetchLocations();
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.issue.image = reader.result as string; // Convert to Base64
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle image upload
  onImageUpload(event: any) {
    const file = event.target.files[0];
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
        this.newIssue = {  
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
