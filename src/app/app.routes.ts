import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProjectComponent } from './components/project/project.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { ProjectCardComponent } from './pages/project-card/project-card.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './components/admin/admin-dashboard/dashboard/dashboard.component';
import { EventsComponent } from './components/admin/admin-dashboard/events/events.component';
import { UsersComponent } from './components/admin/admin-dashboard/users/users.component';
import { SettingsComponent } from './components/admin/admin-dashboard/settings/settings.component';
import { ProjectsComponent } from './components/admin/admin-dashboard/projects/projects.component';
import { NotificationComponent } from './components/admin/admin-dashboard/notification/notification.component';

export const routes: Routes = [
    { path: "", component: LandingComponent },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "projects", component: ProjectComponent },
    { path: "create-project", component: CreateProjectComponent },
    { path: "project-card", component: ProjectCardComponent },
    
    { path: 'admin-dashboard', component: AdminDashboardComponent, children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'events', component: EventsComponent },
        {path: 'projects', component: ProjectsComponent},
        {path: 'users', component:UsersComponent},
        {path:'settings', component: SettingsComponent},
        {path:'notifications', component:NotificationComponent}
    ]}
];
