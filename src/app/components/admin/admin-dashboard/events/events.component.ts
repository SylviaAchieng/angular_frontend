import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../../../services/event.service';
import { AuthService } from '../../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

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


  constructor(private eventService: EventService, private toastr: ToastrService) {}


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


  createEvent() {
    if (!this.newEvent.title || !this.newEvent.description || !this.newEvent.base64EncodedImage) {
      this.toastr.info('Please fill in all required fields, including an image.', 'Info');
      return;
    }
    const imageData = this.newEvent.base64EncodedImage.startsWith("data:image/")
      ? this.newEvent.base64EncodedImage.split(",")[1]
      : this.newEvent.base64EncodedImage;
  
    const eventData = {
      ...this.newEvent,
      base64EncodedImage: imageData  // Send only the Base64 string
    };
    this.eventService.createEvent(eventData).subscribe({
      next: (newEvent) => {
        console.log('Event created successfully', newEvent);
        this.toastr.success('Event created successfully!', 'Success');
        this.isEventFormVisible = false;
        // Reset the form
        this.newEvent = {  
          title: '',
          description: '',
          eventDate:'',
          time: '',
          location: { county: '' },
          base64EncodedImage: ''
        };
      },
      error: (error) => {
        console.error('Error creating project:', error);
        this.toastr.error("Failed to create event. Please try again.", "Error"); 
      }
    });
  }



  updateEvent() {
    if (!this.selectedEvent || !this.selectedEvent.projectId) {
      this.toastr.info('Please select an event to update.', 'Info');
      return;
    }
    const imageData = this.selectedEvent.base64EncodedImage.startsWith("data:image/")
      ? this.selectedEvent.base64EncodedImage.split(",")[1]
      : this.selectedEvent.base64EncodedImage;
  
    const updatedEventData = {
      ...this.selectedEvent,
      base64EncodedImage: imageData  // Send only the Base64 string
    };
    this.eventService.updateEvent(updatedEventData).subscribe({
      next: (updatedEvent) => {
        console.log('event updated successfully:', updatedEvent);        
        this.events = this.events.map((event: any) =>
          event.eventId === updatedEvent.eventId ? updatedEvent : event
        );

        this.toastr.success('Project updated successfully!', 'Success');
      },
      error: (error) => {
        console.error('Error updating project:', error);
        this.toastr.error("Failed to update an event. Please try again.", "Error"); 
      }
    });
  }


  deleteEvent(eventId: any) {
    if (!eventId) {
      console.error("Event ID is undefined, cannot delete.");
      return;
    }
  
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }
  
    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        console.log("Event deleted successfully:", eventId);
        this.toastr.success("Event deleted successfully!", 'Success');
      },
      error: (error) => {
        console.error("Error deleting event:", error);
        this.toastr.error("Failed to delete event.", 'Error');
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
