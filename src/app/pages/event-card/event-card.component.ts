import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
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
