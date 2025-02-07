import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormComponent } from '../form/form.component';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-update-project-form',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,FormsModule, ReactiveFormsModule, MatLabel, MatButtonModule],
  templateUrl: './update-project-form.component.html',
  styleUrl: './update-project-form.component.css'
})
export class UpdateProjectFormComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public project: any,private dialogRef: MatDialogRef<FormComponent>, private projectService: ProjectService){}

  projectItems: any={
    title:"",
    description: "",
    daysRemaining:0,
    tag:"",
    tagColor:"",
    Image:""
  }

  onSubmit(){
    this.projectService.updateProject(this.project.projectId).subscribe();
    console.log("values", this.projectItems)
    this.projectItems = this.project;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
