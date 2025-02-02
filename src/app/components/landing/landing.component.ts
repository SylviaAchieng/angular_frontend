import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProjectCardComponent } from "../../pages/project-card/project-card.component";
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink,NavbarComponent,FooterComponent,CommonModule, ProjectCardComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

  projects =[];

  heroBackground = 'https://i.ibb.co/8Dw3HDN/conference.jpg';
  heroTitle = 'Your Voice, Our Action';
  heroSubtitle =
    'Empowering citizens to engage directly with the government and ensure their concerns are heard.';
  heroPrimaryButton = 'Get Involved';
  heroSecondaryButton = 'Learn More';

  onGetInvolved(): void {
    // Navigate to the Get Involved page or trigger functionality
    console.log('Get Involved button clicked');
  }

  onLearnMore(): void {
    // Navigate to the Learn More page or trigger functionality
    console.log('Learn More button clicked');
  }

  projectsTitle = 'Go Vocal is currently working on';
  seeAllText = 'See all projects';

  // Card Content
  projectImage = 'assests/idea.jpg';
  projectAlt = 'Empty Homes Taxes';
  projectDeadline = '2 days remaining';
  urgencyLabel = 'Urgent';
  projectTitle = '5 potential scenarios for the commercial center';
  projectDescription =
    'To address the City’s housing crisis, we are exploring five scenarios for an empty homes tax aimed at commercial centers, called the Empty Homes Tax...';

  // Participants
  participants = [
    { avatar: 'https://i.ibb.co/YpHsQQr/user-avatar.jpg' },
    { avatar: 'https://i.ibb.co/YpHsQQr/user-avatar.jpg' },
    { avatar: 'https://i.ibb.co/YpHsQQr/user-avatar.jpg' },
  ];
  additionalParticipants = '+12 more';

  // Actions
  likes = 40;
  comments = 8;


  activeFeature: string = 'toolbox';

  // Function to change the feature
  changeFeature(feature: string): void {
    this.activeFeature = feature;
  }

  // Variable to track hovered feature
  hoveredFeature: string = '';

  // Function to handle hover events
  hoverFeature(feature: string): void {
    this.hoveredFeature = feature;
  }


  cards = [
    {
      title: 'Communications & Engagement',
      image: 'assests/home.jpg',
      color: 'bg-green-800',
    },
    {
      title: 'Planning & Placemaking',
      image: 'assests/home.jpg',
      color: 'bg-blue-800',
    },
    {
      title: 'Neighborhoods & Public Safety',
      image: 'assests/home.jpg',
      color: 'bg-red-600',
    },
    {
      title: 'Environment & Sustainability',
      image: 'assests/home.jpg',
      color: 'bg-yellow-500',
    },
  ];
  constructor(private router: Router, public authService: AuthService, private projectService: ProjectService) {}

  onScheduleDemo(): void {
    this.router.navigate(['/schedule-demo']); // Update with your actual route
  }

  trackById(index: number, item: any): any {
    return item.projectId;  // Assuming projectId is unique for each project
  }

  user:any = null;

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.authService.getUserProfile(userId).subscribe({
      next: data=>console.log("req user",data),
      error: error=>console.log("error", error)
      
    });
    this.authService.authSubject.subscribe(
      (auth)=>{
        console.log("auth state", auth)
        this.user = auth.user;
      }
    );
    // Fetch all projects from the backend
  this.projectService.getProjects().subscribe({
    next: () => {
      console.log("Projects retrieved successfully");
    },
    error: (err) => {
      console.error("Failed to load projects:", err);
    }
  });

  // Subscribe to projectSubject to update component state
  this.projectService.projectSubject.subscribe((state) => {
    this.projects = state.projects;
    console.log("Projects state updated:", this.projects);
  });
  }

}
