import { Component } from '@angular/core';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import { AuthService } from '../../../services/auth.service';
import { EventService } from '../../../services/event.service';
import { IssueService } from '../../../services/issue.service';
import { ProjectService } from '../../../services/project.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminChartComponent } from '../../../components/admin/admin-dashboard/admin-chart/admin-chart.component';

@Component({
  selector: 'app-public-servant-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminChartComponent],
  templateUrl: './public-servant-dashboard.component.html',
  styleUrl: './public-servant-dashboard.component.css'
})
export class PublicServantDashboardComponent {
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
    }
    navigateTo(section: string) {
      this.selectedSection = section;
    }
  
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
    
      this.projectService.getProjectByLocationId(locationId).subscribe({
        next: (response: any) => {
          console.log("Projects received:", response);
    
          this.projects = response._embedded?.map((project: any) => ({
            ...project,
            base64EncodedImage: project.base64EncodedImage
              ? `data:image/jpg;base64,${project.base64EncodedImage}`
              : null
          })) || [];
    
          console.log("Formatted events:", this.projects);
        },
        error: (error) => {
          console.error("Error fetching events:", error);
        }
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
      console.log("Location ID:", locationId);
    
      this.eventService.getEventByLocationId(locationId).subscribe({
        next: (response: any) => {
          console.log("Events received:", response);
    
          this.events = response._embedded?.map((event: any) => ({
            ...event,
            base64EncodedImage: event.base64EncodedImage
              ? `data:image/jpg;base64,${event.base64EncodedImage}`
              : null
          })) || [];
    
          console.log("Formatted events:", this.events);
        },
        error: (error) => {
          console.error("Error fetching events:", error);
        }
      });
    }
  
    getAllIssues(): void {
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

}
