import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { RsvpService } from '../../services/rsvp.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,NavbarComponent],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent {

  event: any;
  rsvpForm: FormGroup;
  rsvps: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private rsvpService: RsvpService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.rsvpForm = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ngOnInit() {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEventDetails();
    this.loadRsvps(eventId);
  }


loadEventDetails(): void {
  const eventId = this.route.snapshot.paramMap.get('id');
  const userId = localStorage.getItem('userId');
  if (eventId && userId) {
    this.eventService.getEventById(eventId).subscribe((response: any) => {
      if (response && response._embedded) {
        const eventData = response._embedded;
        this.event = {
          ...eventData,
          base64EncodedImage: eventData.base64EncodedImage
            ? `data:image/jpg;base64,${eventData.base64EncodedImage}`
            : null,
        };
        console.log("Formatted event:", this.event);
      } else {
        console.error("Event data missing in response.");
      }
    });
    // Subscribe to eventSubject for real-time updates
    this.eventService.eventSubject.subscribe((state: any) => {
      if (state.event) {
        this.event = {
          ...state.event,
          base64EncodedImage: state.event.base64EncodedImage
            ? `data:image/jpg;base64,${state.event.base64EncodedImage}`
            : null,
        };
        console.log("Updated event state:", this.event);
      }
    });
  } else {
    console.error("Missing Event ID or user ID.");
  }
}



submitRsvp() {
  if (this.rsvpForm.invalid) {
    this.toastr.warning("Please fill out all required fields", "Validation Error");
    return;
  }

  if (!this.event || !this.event.eventId) {
    this.toastr.error("Invalid event details", "Error");
    return;
  }

  const rsvpRequest = {
    user: { fullName: this.rsvpForm.value.fullName, email: this.rsvpForm.value.email },
    event: { eventId: this.event.eventId }
  };

  console.log("RSVP Request Payload:", JSON.stringify(rsvpRequest));

  this.rsvpService.addRSVP(rsvpRequest).subscribe({
    next: (response) => {
      console.log("RSVP API Response:", response);

      if (response?.status === "SUCCESS") {
        this.toastr.success(response.message || "RSVP confirmed successfully!", "Success");
        this.rsvpForm.reset();
      } else {
        this.toastr.warning(response.message || "Unexpected response from server.", "Warning");
      }
    },
    error: (error) => {
      console.error("RSVP failed:", error);

      // Extract error message from backend response
      const errorMessage = error?.error?.message || "Failed to RSVP. Try again later.";

      if (errorMessage.includes("Event already closed")) {
        this.toastr.warning("This event has already ended. You cannot RSVP.", "Event Closed");
      } else if (errorMessage.includes("You have already RSVPed for this event")) {
        this.toastr.info("You have already RSVPed for this event.", "Duplicate RSVP");
      } else {
        this.toastr.error(errorMessage, "Error");
      }
    }
  });
}

loadRsvps(eventId: number) {
  this.rsvpService.getAllRsvps(eventId).subscribe({
    next: (response) => {
      this.rsvps = response._embedded || []; // Ensure it’s an array
    },
    error: (err) => {
      console.error('Error fetching rsvps:', err);
    }
  });
}





}
