import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js';
import { AdminChartComponent } from "../admin-chart/admin-chart.component";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import { AuthService } from '../../../../services/auth.service';
import { EventService } from '../../../../services/event.service';
import { IssueService } from '../../../../services/issue.service';
import { ProjectService } from '../../../../services/project.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, AdminChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  selectedSection = 'dashboard';
  events: any[] = [];
  calendarData: any[] = [];
  users:any;
  eventList: any[]=[];
  issues: any[] = [];
  projects: any[] = [];
  project:any[] = [];

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private issueService: IssueService,
    private projectService: ProjectService
  ){}

  ngOnInit(){
    this.loadUsers();
    this.getAllEvents();
    this.getAllIssues();
    this.generateCalendar();
    this.getAllProjects();
    this.getACtiveProjects();
  }
  navigateTo(section: string) {
    this.selectedSection = section;
  }

  // generateCalendar() {
  //   const today = new Date();
  //   const start = startOfWeek(startOfMonth(today));
  //   const end = endOfWeek(endOfMonth(today));
  //   const days = eachDayOfInterval({ start, end });

  //   this.calendarData = [];
  //   let week: any[] = [];
  //   days.forEach((day, index) => {
  //     if (index % 7 === 0 && index !== 0) {
  //       this.calendarData.push(week);
  //       week = [];
  //     }
  //     week.push({ date: format(day, 'd'), isToday: format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') });
  //   });
  //   this.calendarData.push(week);
  // }

  generateCalendar() {
    const today = new Date();
    const firstDayOfMonth = startOfMonth(today);
    const lastDayOfMonth = endOfMonth(today);
    const start = startOfWeek(firstDayOfMonth, { weekStartsOn: 0 }); // Ensure Sunday start
    const end = endOfWeek(lastDayOfMonth, { weekStartsOn: 0 });
  
    const days = eachDayOfInterval({ start, end });
    this.calendarData = [];
    let week: any[] = [];
  
    days.forEach((day, index) => {
      if (index % 7 === 0 && index !== 0) {
        this.calendarData.push(week);
        week = [];
      }
      week.push({
        date: day.getMonth() === today.getMonth() ? format(day, 'd') : '', // Show only current month dates
        isToday: format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
      });
    });
  
    if (week.length) {
      this.calendarData.push(week);
    }
  }

  getAllProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (response: any) => {
        console.log("Projects retrieved successfully:", response);
  
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
        this.projectService.projectSubject.next({ project: formattedProjects });
      },
      error: (err) => {
        console.error("Failed to load projects:", err);
      }
    });
    this.projectService.projectSubject.subscribe((state: any) => {
      this.project = state.project;
      console.log("Projects state updated with images:", this.project);
    });
  }
  
  getACtiveProjects(): void {
    this.projectService.getActiveProjects().subscribe({
      next: (response: any) => {
        console.log("Projects retrieved successfully:", response);
  
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

  loadUsers(): void {
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
  

}
