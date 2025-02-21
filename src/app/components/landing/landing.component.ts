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
import { ToastrService } from 'ngx-toastr';
import { ProjectDetailsComponent } from "../../pages/project-details/project-details.component";



@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, ProjectCardComponent, EventCardComponent, ProjectDetailsComponent, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  @Input() project: any;

  projectWithLeastDays: any;

  projects =[];

  eventList: any[]=[];
  

  constructor(private router: Router, 
    public authService: AuthService, 
    private projectService: ProjectService, 
    private eventService: EventService,
    private toastr: ToastrService,
    private route: Router
  ) {}

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
      route: '/communication'
    },
    {
      title: 'Planning & Placemaking',
      image: 'assests/home.jpg',
      color: 'bg-blue-800',
      route: '/planning'
    },
    {
      title: 'Neighborhoods & Public Safety',
      image: 'assests/home.jpg',
      color: 'bg-red-600',
      route: '/neighbourhood'
    },
    {
      title: 'Environment & Sustainability',
      image: 'assests/home.jpg',
      color: 'bg-yellow-500',
      route: '/environment'
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

  // getAllProjects(): void {
  //   this.projectService.getProjects().subscribe({
  //     next: (response: any) => {
  //       if (!response || !response._embedded) {
  //         console.error("Invalid response format");
  //         return;
  //       }
  //       const formattedProjects = response._embedded.map((project: any) => ({
  //         ...project,
  //         base64EncodedImage: project.base64EncodedImage?.startsWith("data:image/")
  //           ? project.base64EncodedImage  // Already formatted correctly
  //           : `data:image/jpeg;base64,${project.base64EncodedImage}`  // Add prefix only if missing
  //       }));
  //       this.projectService.projectSubject.next({ projects: formattedProjects });
  //     },
  //     error: (err) => {
  //       console.error("Failed to load projects:", err);
  //     }
  //   });
  
  //   this.projectService.projectSubject.subscribe((state: any) => {
  //     this.projects = state.projects;
  //     console.log("Projects state updated with images:", this.projects);
  //   });
  // }

  getAllProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (response: any) => {
        if (!response || !response._embedded) {
          console.error("Invalid response format");
          return;
        }
        this.projects = response._embedded.map((project: any) => ({
          ...project,
          base64EncodedImage: project.base64EncodedImage?.startsWith("data:image/")
            ? project.base64EncodedImage
            : `data:image/jpeg;base64,${project.base64EncodedImage}`
        }));
        console.log("All Projects:", this.projects);
      },
      error: (err) => console.error("Failed to load projects:", err)
    });
  }
  
  


  getAllEvents(): void {
    this.eventService.getAllEvents().subscribe((response: any) => {
      console.log("Events received:", response); // Debugging
  
      const today = new Date(); // Define `today` inside the function
  
      this.eventList = response._embedded?.filter((event: any) => {
        const eventDate = new Date(event.eventDate);
        return eventDate >= today; // Only include upcoming or ongoing events
      }).map((event: any) => ({
        ...event,
        base64EncodedImage: event.base64EncodedImage
          ? `data:image/jpg;base64,${event.base64EncodedImage}`
          : null
      })) || [];
  
      console.log("Filtered and formatted events:", this.eventList);
    });
  
    // Subscribe to eventSubject for real-time updates
    this.eventService.eventSubject.subscribe((state: any) => {
      const today = new Date(); // Define `today` again inside the subscribe function
  
      this.eventList = state.events?.filter((event: any) => {
        const eventDate = new Date(event.eventDate);
        return eventDate >= today; // Only include upcoming or ongoing events
      }).map((event: any) => ({
        ...event,
        base64EncodedImage: event.base64EncodedImage
          ? `data:image/jpg;base64,${event.base64EncodedImage}`
          : null
      })) || [];
  
      console.log("Updated filtered events state:", this.eventList);
    });
  }


  // loadProjectDetails(): void {
  //   this.projectService.getProjects().subscribe({
  //     next: (response: any) => {
  //       if (response && response._embedded) {
  //         const projects = response._embedded;
  
  //         if (Array.isArray(projects) && projects.length > 0) {
  //           // Ensure all projects have 'daysRemaining' before sorting
  //           const validProjects = projects.filter(proj => proj.daysRemaining !== undefined && proj.daysRemaining !== null);
  
  //           if (validProjects.length > 0) {
  //             // Find the project with the least number of days remaining
  //             this.project = validProjects.reduce((minProject, currentProject) => 
  //               currentProject.daysRemaining < minProject.daysRemaining ? currentProject : minProject
  //             );
  
  //             // Ensure image format
  //             if (this.project.base64EncodedImage) {
  //               this.project.base64EncodedImage = `data:image/jpg;base64,${this.project.base64EncodedImage}`;
  //             }
  
  //             console.log("Selected Project (Least Days Remaining):", this.project);
  //           } else {
  //             console.warn("No valid projects with 'daysRemaining' found");
  //             this.project = null;
  //           }
  //         } else {
  //           console.warn("No projects available");
  //           this.project = null;
  //         }
  //       } else {
  //         console.warn("Invalid API response format");
  //         this.project = null;
  //       }
  //     },
  //     error: (error) => {
  //       console.error("Failed to load projects:", error);
  //       this.toastr.error("Failed to fetch projects", "Error");
  //       this.project = null;
  //     }
  //   });
  // }
  

  loadProjectDetails(): void {
    this.projectService.getProjects().subscribe({
      next: (response: any) => {
        if (response && response._embedded) {
          const projects: any[] = response._embedded;
  
          // Filter out projects that have a valid `daysRemaining` property
          const validProjects = projects.filter(
            (proj: any) =>
              proj.daysRemaining !== undefined && proj.daysRemaining !== null
          );
  
          if (validProjects.length > 0) {
            this.projectWithLeastDays = validProjects.reduce(
              (minProject: any, currentProject: any) =>
                currentProject.daysRemaining < minProject.daysRemaining
                  ? currentProject
                  : minProject
            );
  
            // Ensure the base64 image format is correct
            if (this.projectWithLeastDays.base64EncodedImage) {
              this.projectWithLeastDays.base64EncodedImage = `data:image/jpg;base64,${this.projectWithLeastDays.base64EncodedImage}`;
            }
  
            console.log(
              "Selected Project (Least Days Remaining):",
              this.projectWithLeastDays
            );
          } else {
            console.warn("No valid projects with 'daysRemaining' found");
            this.projectWithLeastDays = null;
          }
        } else {
          console.warn("Invalid API response format");
          this.projectWithLeastDays = null;
        }
      },
      error: (error) => {
        console.error("Failed to load projects:", error);
        this.toastr.error("Failed to fetch projects", "Error");
        this.projectWithLeastDays = null;
      },
    });
  }
  
  
  

}
