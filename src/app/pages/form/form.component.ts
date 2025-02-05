import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,FormsModule, ReactiveFormsModule, MatLabel, MatButtonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

  constructor(private dialogRef: MatDialogRef<FormComponent>, private projectService: ProjectService){}

  projectItems: any={
    title:"",
    description: "",
    daysRemaining:0,
    tag:"",
    tagColor:"",
    Image:""
  }

  onSubmit(){
    console.log("values", this.projectItems);
    this.projectService.createProject(this.projectItems).subscribe(
      {
        next:data=>console.log("project created successfully"),
        error: error=>console.log("error", error)
      }
    )
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
