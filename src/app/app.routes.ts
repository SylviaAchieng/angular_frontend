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
import { AllDiscussionsComponent } from './discussions/all-discussions/all-discussions.component';
import { CreateDiscussionComponent } from './discussions/create-discussion/create-discussion.component';
import { DiscussionDetailsComponent } from './discussions/discussion-details/discussion-details.component';
import { EventDetailsComponent } from './pages/event-details/event-details.component';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';
import { ProjectCardDetailsComponent } from './pages/project-card-details/project-card-details.component';
import { IssuesPageComponent } from './issue-reporting/issues-page/issues-page.component';
import { CommunicationComponent } from './about-us/communication/communication.component';
import { EnvironmentComponent } from './about-us/environment/environment.component';
import { NeighbourhoodComponent } from './about-us/neighbourhood/neighbourhood.component';
import { PlanningComponent } from './about-us/planning/planning.component';
import { ContactUsComponent } from './contact-us/contact-us/contact-us.component';
import { PublicServantComponent } from './public-servant/public-servant/public-servant.component';
import { PublicServantDashboardComponent } from './public-servant/public-servant/public-servant-dashboard/public-servant-dashboard.component';
import { AllEventsComponent } from './public-servant/public-servant/all-events/all-events.component';
import { AllProjectsComponent } from './public-servant/public-servant/all-projects/all-projects.component';
import { AllIssuesComponent } from './public-servant/public-servant/all-issues/all-issues.component';
import { IssuesComponent } from './components/admin/admin-dashboard/issues/issues.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { DiscussionComponent } from './components/admin/admin-dashboard/discussion/discussion.component';




export const routes: Routes = [
    { path: "", component: LandingComponent },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "projects", component: ProjectComponent },
    { path: "create-project", component: CreateProjectComponent },
    { path: "project-card", component: ProjectCardComponent },
    {path:"discussion", component: AllDiscussionsComponent},
    {path: "create-discussion", component: CreateDiscussionComponent},
    {path:"discussion-details/:id", component:DiscussionDetailsComponent},
    { path: 'event-details/:id', component: EventDetailsComponent },
    { path: 'project-details/:id', component: ProjectCardDetailsComponent },
    {path: 'project-details', component:ProjectDetailsComponent},
    {path: 'issue-page', component: IssuesPageComponent},
    {path: 'communication', component: CommunicationComponent},
    {path: 'environment', component: EnvironmentComponent},
    {path: 'neighbourhood', component: NeighbourhoodComponent},
    {path: 'planning', component: PlanningComponent},
    {path: 'contact-us', component: ContactUsComponent},
    {path: 'all-events', component: EventPageComponent},

    
    { path: 'admin-dashboard', component: AdminDashboardComponent, children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'events', component: EventsComponent },
        {path: 'projects', component: ProjectsComponent},
        {path: 'users', component:UsersComponent},
        {path:'settings', component: SettingsComponent},
        {path:'notifications', component:NotificationComponent},
        {path:'reportings', component: IssuesComponent},
        {path: 'proposals', component: DiscussionComponent},
    ]},

    { path: 'public-servant', component: PublicServantComponent, children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: PublicServantDashboardComponent },
        { path: 'events', component: AllEventsComponent },
        {path: 'projects', component: AllProjectsComponent},
        {path: 'issues', component:AllIssuesComponent},
        {path:'settings', component: SettingsComponent},
        {path:'notifications', component:NotificationComponent}
    ]}
];
