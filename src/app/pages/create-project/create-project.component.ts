import { Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ProjectComponent } from '../../components/project/project.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormComponent } from '../form/form.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { ProjectCardComponent } from "../project-card/project-card.component";
import { LandingComponent } from "../../components/landing/landing.component";
import { ProjectsComponent } from '../../components/admin/admin-dashboard/projects/projects.component';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule, LandingComponent, ProjectsComponent],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.css'
})
export class CreateProjectComponent {

  constructor(public dialog: MatDialog) {}

  openProjectDialog() {
    this.dialog.open(FormComponent, {
      width: '400px',  // Set dialog width
      disableClose: true, // Prevent closing by clicking outside
      panelClass: 'bg-black text-white' // Apply black background
    });
  }

  openCreateProjectForm(){
    this.dialog.open(FormComponent);
  }

}
