import { Component, Input } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProjectCardComponent } from "../../pages/project-card/project-card.component";
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { EventCardComponent } from "../../pages/event-card/event-card.component";
import { EventService } from '../../services/event.service';



@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, CommonModule, ProjectCardComponent, EventCardComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  @Input() project: any;

  projects =[];

  eventList: any[]=[];

  eventLists = [1, 1, 1, 1, 11, 1].map(() => ({
    base64EncodedImage: 'assests/event1.jpeg',
    date: '24 Jan, 2024',
    time: '10:00 AM - 2:00 PM',
    title: 'Siempre Son Flores* Musica Cubana Salsa Jazz',
    description: 'Join industry leaders and innovators as we explore the latest trends in technology and innovation.',
    location: '135 W, 46nd Street, New York'
  }));
  

  // eventData = {
  //   base64EncodedImage: 'assests/home.jpg',
  //   date: '24 Jan, 2024',
  //   time: '10:00 AM - 2:00 PM',
  //   title: 'Siempre Son Flores* Musica Cubana Salsa Jazz',
  //   description: 'join us for a night of music and dancing with siempr son flores, a cuban band that plays salsa, jazz, and more!',
  //   location: '135 W, 46nd Street, New York',
  // };


  constructor(private router: Router, public authService: AuthService, private projectService: ProjectService, private eventService: EventService) {}

  // TrackBy function using index
  trackByEventId(index: number, event: any): number {
    return index; // Use the index as the unique identifier
  }

  heroBackground = 'https://i.ibb.co/8Dw3HDN/conference.jpg';
  //heroBackground = 'assests/confernce.jpeg';
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

  loadFeaturedProject(): void {
    this.projectService.getProjectById(1).subscribe({
      next: (project) => {
        this.projects = project;
      },
      error: (err) => console.error('Error fetching project:', err)
    });
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
  this.loadFeaturedProject();
  this.getAllEvents();
  this.getAllProjects();
  }

  getAllProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (response: any) => {
        if (!response || !response._embedded) {
          console.error("Invalid response format");
          return;
        }
        const formattedProjects = response._embedded.map((project: any) => ({
          ...project,
          base64EncodedImage: project.base64EncodedImage?.startsWith("data:image/")
            ? project.base64EncodedImage  // Already formatted correctly
            : `data:image/jpeg;base64,${project.base64EncodedImage}`  // Add prefix only if missing
        }));
        this.projectService.projectSubject.next({ projects: formattedProjects });
      },
      error: (err) => {
        console.error("Failed to load projects:", err);
      }
    });
  
    this.projectService.projectSubject.subscribe((state: any) => {
      this.projects = state.projects;
      console.log("Projects state updated with images:", this.projects);
    });
  }
  
  

  getAllEvents(): void {
    this.eventService.getAllEvents().subscribe((response: any) => {
      console.log("Events received:", response); // Debugging
      this.eventList = response._embedded?.map((event: any) => ({
        ...event,
        base64EncodedImage: event.base64EncodedImage
          ? `data:image/jpg;base64,${event.base64EncodedImage}`
          : null
      })) || [];
      console.log("Formatted events:", this.eventList);
    });
    // Subscribe to eventSubject to update component state
    this.eventService.eventSubject.subscribe((state: any) => {
      this.eventList = state.events?.map((event: any) => ({
        ...event,
        base64EncodedImage: event.base64EncodedImage
          ? `data:image/jpg;base64,${event.base64EncodedImage}`
          : null
      })) || [];
  
      console.log("Updated events state:", this.eventList);
    });
  }
  

}
