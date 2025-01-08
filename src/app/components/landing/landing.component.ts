import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink,NavbarComponent,FooterComponent, CommonModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

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

  projects = [
    {
      image: 'assests/idea.jpg',
      title: '5 potential scenarios for the commercial center',
      description:
        'To address Vancouver’s housing crisis, we are exploring five scenarios for an empty homes tax aimed at commercial centers, called the Empty Homes Tax...',
      daysRemaining: 2,
      tag: 'Urgent',
      tagColor: 'red',
      participants: 12,
      comments: 8,
      likes: 40
    },
    {
      image: 'assests/logo.jpg',
      title: 'New Castle Park',
      description:
        'New Castle Park is under construction to provide better facilities for citizens and promote community engagement...',
      daysRemaining: 5,
      tag: 'On Track',
      tagColor: 'green',
      participants: 15,
      comments: 12,
      likes: 34
    },
    {
      image: 'assests/logo.jpg',
      title: 'Mobility in the Area of Mainstream',
      description:
        'The Mobility Project focuses on improving access and infrastructure for pedestrians and cyclists in the Mainstream area...',
      daysRemaining: 7,
      tag: 'Planned',
      tagColor: 'yellow',
      participants: 10,
      comments: 6,
      likes: 28
    }
  ];

  

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
  
  constructor() {}

  ngOnInit(): void {
    // Here you'd fetch data from the backend
    // Example:
    // this.httpClient.get('your-api-endpoint').subscribe((data: any) => {
    //   this.projects = data;
    // });
  }

}
