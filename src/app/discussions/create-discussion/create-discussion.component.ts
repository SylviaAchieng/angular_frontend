import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from "../../components/footer/footer.component";
import { DiscussionService } from '../../services/discussion.service';

@Component({
  selector: 'app-create-discussion',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './create-discussion.component.html',
  styleUrl: './create-discussion.component.css'
})
export class CreateDiscussionComponent {

  constructor(private discussionService: DiscussionService, private router: Router){}

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
          // Show success alert
        window.alert("Discussion created successful!");
        },
      error: (err) => {
        console.error("failed", err);
        window.alert("Failed to create a discussion. Please try again.");
      }
      });
    }

    handleCancel(){
      this.router.navigate(['/discussion']);
    }

    

}
