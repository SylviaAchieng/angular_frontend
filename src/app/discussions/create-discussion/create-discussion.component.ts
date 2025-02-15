import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";
import { DiscussionService } from '../../services/discussion.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-discussion',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './create-discussion.component.html',
  styleUrl: './create-discussion.component.css'
})
export class CreateDiscussionComponent {

  constructor(private discussionService: DiscussionService, private router: Router, private toastr: ToastrService){}

  discussionForm=new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      user: new FormGroup({
        fullName: new FormControl(null, [Validators.required])
      })
    });

    onSubmit(){
      this.discussionService.createDiscussion(this.discussionForm.value).subscribe({
        next:(response)=>{
          this.toastr.success("Discussion created successfully!", "Success");
          this.router.navigate(['/discussion']);
        },
      error: (err) => {
        console.error("failed", err);
        this.toastr.error("Failed to create a discussion. Please try again.", "Error"); 
      }
      });
    }

    handleCancel(){
      this.router.navigate(['/discussion']);
    }

    

}
