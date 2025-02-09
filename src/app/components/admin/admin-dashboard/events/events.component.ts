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

  isEventFormVisible = false;

  newEvent = {
    title: '',
    eventDate: '',
    time: '',
    description: '',
    location: { county: '' },
    base64EncodedImage: '' // Stores encoded image
  };


  constructor(private eventService: EventService) {}


   ngOnInit(): void {
     this.loadEvents();
   }

   loadEvents(): void {
    this.eventService.getAllEvents().subscribe((response: any) => {
      console.log("Events received:", response); // Debugging
      this.events = response._embedded?.map((event: any) => ({
        ...event,
        base64EncodedImage: event.base64EncodedImage
          ? `data:image/jpg;base64,${event.base64EncodedImage}`
          : null
      })) || [];
      console.log("Formatted events:", this.events);
    });
    // Subscribe to eventSubject to update component state
    this.eventService.eventSubject.subscribe((state: any) => {
      this.events = state.events?.map((event: any) => ({
        ...event,
        base64EncodedImage: event.base64EncodedImage
          ? `data:image/jpg;base64,${event.base64EncodedImage}`
          : null
      })) || [];
  
      console.log("Updated events state:", this.events);
    });
  }


  toggleEventForm() {
    this.isEventFormVisible = !this.isEventFormVisible;
  }

  // Handle image upload
  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newEvent.base64EncodedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Clear selected image
  clearImage() {
    this.newEvent.base64EncodedImage = '';
  }

  // Submit Event to API
  createEvent() {
    // Retrieve userId from localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert('User not found. Please log in again.');
      return;
    }
    const user = JSON.parse(storedUser);
    if (user.userType !== 'admin') {
      alert('Only admins can create events.');
      return;
    }
  
    // Validate required fields
    if (!this.newEvent.title || !this.newEvent.eventDate || !this.newEvent.time || !this.newEvent.location.county) {
      alert('All fields are required');
      return;
    }
  
    const eventPayload = {
      user: { userId: user.userId }, // Retrieved from localStorage
      title: this.newEvent.title,
      description: this.newEvent.description || '',
      createdAt: new Date().toISOString().split('T')[0],
      eventDate: this.newEvent.eventDate,
      time: this.newEvent.time,
      location: { location: this.newEvent.location.county },
      base64EncodedImage: this.newEvent.base64EncodedImage || ''
    };
  
    this.eventService.createEvent(eventPayload).subscribe({
      next: (response) => {
        console.log('Event created:', response);
  
        // Add the event to the list only if it was created successfully
        this.events.unshift(response);
  
        // Show success alert
        alert('Event created successfully!');
  
        // Reset form fields
        this.newEvent = { title: '', eventDate: '', time: '', description: '', location: { county: '' }, base64EncodedImage: '' };
  
        // Hide event form
        this.toggleEventForm();
      },
      error: (error) => {
        console.error('Error creating event:', error);
        alert(error.error?.message || 'Failed to create event');
      }
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
