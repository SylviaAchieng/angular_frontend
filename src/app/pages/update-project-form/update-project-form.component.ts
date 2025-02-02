import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-update-project-form',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,FormsModule, ReactiveFormsModule, MatLabel, MatButtonModule],
  templateUrl: './update-project-form.component.html',
  styleUrl: './update-project-form.component.css'
})
export class UpdateProjectFormComponent {

  constructor(private dialogRef: MatDialogRef<FormComponent>){}

  projectItems: any={
    title:"",
    description: "",
    daysRemaining:0,
    tag:"",
    tagColor:"",
    Image:""
  }

  onSubmit(){
    console.log("values", this.projectItems)
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
