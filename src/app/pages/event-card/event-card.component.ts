import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {

  @Input() event: any; // Expecting an object with event details

  

  isRsvped: boolean = false;

  toggleRSVP() {
    this.isRsvped = !this.isRsvped;
  }

  ngOnInit(): void {
    console.log("project details:", this.event)
  }

}
