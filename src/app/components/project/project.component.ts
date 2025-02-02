import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProjectFormComponent } from '../../pages/update-project-form/update-project-form.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, MatIcon, MatCardModule, MatButtonModule, MatIconModule,],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {

  constructor(public dialog: MatDialog){}

  handleOpenUpdateProjectForm(){
    this.dialog.open(UpdateProjectFormComponent)
  }

  likes = 23;
  comments = 15;

  increaseLikes() {
    this.likes++;
  }

  increaseComments() {
    this.comments++;
  }

  editProject() {
    alert('Edit project clicked!');
    // Implement edit functionality here
  }

  deleteProject() {
    alert('Delete project clicked!');
    // Implement delete functionality here
  }

}
