import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProjectFormComponent } from '../../pages/update-project-form/update-project-form.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, MatIcon, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() project: any;
  @Output() deleteProjectEvent = new EventEmitter<number>();

  constructor(public dialog: MatDialog, private projectService: ProjectService){}

  ngOnInit(): void {
    console.log("project details:", this.project)
  }

}
