import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProjectComponent } from './components/project/project.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { ProjectCardComponent } from './pages/project-card/project-card.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';


export const routes: Routes = [
    {path: "", component: LandingComponent },
    {path: "login", component:LoginComponent},
    {path: "register", component: RegisterComponent},
    {path: "projects", component:ProjectComponent},
    {path:"create-project", component:CreateProjectComponent},
    {path:"project-card", component: ProjectCardComponent},
    {path:"admin-dashboard", component: AdminDashboardComponent}
];
