import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../services/event.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {

 // @Input() event: any;

  events: any;
  paginatedEvents: any[] = [];
  selectedEvent: any = null;
  isViewing = false;
  currentPage = 1;
  visiblePages: number[] = [];
  vipPrice: number = 0;
  regularPrice: number=0;
  totalTickets: number=0;
  itemsPerPage: number=5;
  isDeleted: boolean=false;

  eventItems: any = {
    title: "",
    description: "",
    eventDate: "",
    time: "",
    createdAt: "",
    base64EncodedImage: "",
    location: " ",
    user: null
  };


  constructor(private eventService: EventService) {}


   ngOnInit(): void {
     this.loadEvents();
   }

   loadEvents(): void {
    this.eventService.getAllEvents().subscribe(events => {
      console.log("Events received:", events); // Debugging
      this.events = events._embedded || []; 
      
    });

    // Subscribe to projectSubject to update component state
  this.eventService.eventSubject.subscribe((state) => {
    this.events = state.events;
    console.log("events state updated:", this.events);
  });
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.events.length / this.itemsPerPage);
    this.visiblePages = Array.from({ length: totalPages }, (_, i) => i + 1);
    this.setPage(this.currentPage);
  }

  setPage(page: number): void {
    if (page < 1 || page > this.visiblePages.length) return;
    this.currentPage = page;
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEvents = this.events.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.visiblePages.length) {
      this.setPage(this.currentPage + 1);
    }
  }

  toggleEventVisibility(event: any): void {
    event.isDeleted = !event.isDeleted;
  }

  showViewEventModal(event: any): void {
    this.selectedEvent = event;
    // this.vipPrice = event.ticketTypes.find(t => t.type === 'VIP')?.price || null;
    // this.regularPrice = event.ticketTypes.find(t => t.type === 'Regular')?.price || null;
    // this.totalTickets = event.ticketTypes.reduce((total, t) => total + t.quantity, 0) || null;
    this.isViewing = true;
  }

  closeViewEventModal(): void {
    this.isViewing = false;
    this.selectedEvent = null;
    this.vipPrice = 0;
    this.regularPrice = 0;
    this.totalTickets = 0;
  }

}
