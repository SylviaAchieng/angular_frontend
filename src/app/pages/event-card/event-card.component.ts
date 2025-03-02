import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css'
})
export class EventCardComponent {

  @Input() event: any; // Expecting an object with event details

  constructor(private route: ActivatedRoute) {}

  isRsvped: boolean = false;

  toggleRSVP() {
    this.isRsvped = !this.isRsvped;
  }

  ngOnInit(): void {
    console.log("project details:", this.event)
    // Force scroll to top
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100); // Delay to allow Angular to render the page

    // If the route has a fragment (e.g., #top), scroll to it
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  

}
