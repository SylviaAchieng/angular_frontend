import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/events`);
  }

  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.baseUrl}/events/${id}`);
  }

  

  // getUniqueLocations(): Observable<string[]> {
  //   return this.getAllEvents().pipe(
  //     map(events => Array.from(new Set(events.map(event => event.location))))
  //   );
  // }

  
  getEventsByManager(managerId: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.baseUrl}/events/manager/${managerId}`, { headers: this.getAuthHeaders() });
  }

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${this.baseUrl}/events`, event, { headers: this.getAuthHeaders() });
  }

  updateEvent(id: string, event: Event): Observable<Event> {
    console.log('Update Event Payload:', event); 
    return this.http.put<Event>(`${this.baseUrl}/events/${id}`, event, { headers: this.getAuthHeaders() });
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/events/${id}`, { headers: this.getAuthHeaders() });
  }
}
