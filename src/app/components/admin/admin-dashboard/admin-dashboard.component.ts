import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { EventsComponent } from "./events/events.component";
import { UsersComponent } from "./users/users.component";
import { ProjectsComponent } from "./projects/projects.component";
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SidebarComponent, CommonModule, RouterOutlet, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  
}
