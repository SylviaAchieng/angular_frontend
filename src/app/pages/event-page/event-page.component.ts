import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventCardComponent } from '../event-card/event-card.component';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { FooterComponent } from '../../components/footer/footer.component';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-event-page',
  standalone: true,
  imports: [CommonModule, FormsModule, EventCardComponent, NavbarComponent, FooterComponent],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.css'
})
export class EventPageComponent {
  upcomingEvents: Event[] = [];
  pastEvents: any[] = [];
  eventList: any[]=[];


  heroImage: string = 'assests/event.jpeg';

  constructor(
    private eventService: EventService
  ){}

  ngOnInit(): void {
    this.getAllEvents();
    this.getPastEvents();
  }

  getAllEvents(): void {
    this.eventService.getAllEvents().subscribe((response: any) => {
      console.log("Events received:", response); // Debugging
  
      const today = new Date(); // Define `today` inside the function
  
      this.eventList = response._embedded?.filter((event: any) => {
        const eventDate = new Date(event.eventDate);
        return eventDate >= today; // Only include upcoming or ongoing events
      }).map((event: any) => ({
        ...event,
        base64EncodedImage: event.base64EncodedImage
          ? `data:image/jpg;base64,${event.base64EncodedImage}`
          : null
      })) || [];
  
      console.log("Filtered and formatted events:", this.eventList);
    });
  
    // Subscribe to eventSubject for real-time updates
    this.eventService.eventSubject.subscribe((state: any) => {
      const today = new Date(); // Define `today` again inside the subscribe function
  
      this.eventList = state.events?.filter((event: any) => {
        const eventDate = new Date(event.eventDate);
        return eventDate >= today; // Only include upcoming or ongoing events
      }).map((event: any) => ({
        ...event,
        base64EncodedImage: event.base64EncodedImage
          ? `data:image/jpg;base64,${event.base64EncodedImage}`
          : null
      })) || [];
  
      console.log("Updated filtered events state:", this.eventList);
    });
  }

  getPastEvents(): void {
    this.eventService.getPastEvents().subscribe((response: any) => {
      console.log("Events received:", response); // Debugging
  
      const today = new Date(); // Define `today` inside the function
  
      this.pastEvents = response._embedded?.filter((event: any) => {
        const eventDate = new Date(event.eventDate);
        return eventDate < today; // Only include upcoming or ongoing events
      }).map((event: any) => ({
        ...event,
        base64EncodedImage: event.base64EncodedImage
          ? `data:image/jpg;base64,${event.base64EncodedImage}`
          : null
      })) || [];
  
      console.log("Filtered and formatted events:", this.pastEvents);
    });
  
    // Subscribe to eventSubject for real-time updates
    this.eventService.eventSubject.subscribe((state: any) => {
      const today = new Date(); // Define `today` again inside the subscribe function
  
      this.pastEvents = state.events?.filter((event: any) => {
        const eventDate = new Date(event.eventDate);
        return eventDate < today; // Only include upcoming or ongoing events
      }).map((event: any) => ({
        ...event,
        base64EncodedImage: event.base64EncodedImage
          ? `data:image/jpg;base64,${event.base64EncodedImage}`
          : null
      })) || [];
  
      console.log("Updated filtered events state:", this.pastEvents);
    });
  }

}
