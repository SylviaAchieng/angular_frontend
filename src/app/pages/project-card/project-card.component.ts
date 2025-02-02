import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProjectFormComponent } from '../../pages/update-project-form/update-project-form.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, MatIcon, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {

  constructor(public dialog: MatDialog){}

  handleOpenUpdateProjectForm(){
      this.dialog.open(UpdateProjectFormComponent)
    }

}
