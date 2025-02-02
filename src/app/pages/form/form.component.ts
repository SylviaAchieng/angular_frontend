import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule, MatLabel} from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,FormsModule, ReactiveFormsModule, MatLabel, MatButtonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {

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
