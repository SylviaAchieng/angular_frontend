import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventCardComponent } from '../event-card/event-card.component';
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-event-page',
  standalone: true,
  imports: [CommonModule, FormsModule, EventCardComponent, NavbarComponent],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.css'
})
export class EventPageComponent {
  upcomingEvents: Event[] = [];
  pastEvents: Event[] = [];

  heroImage: string = 'assests/event.jpeg';

}
