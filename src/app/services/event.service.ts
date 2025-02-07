import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'http://localhost:8000'
  
  constructor(private http : HttpClient) {}

  eventSubject = new BehaviorSubject<any>({
        events: [],
        loading: false,
        newProject: null
      });
  
      private getHeaders(): HttpHeaders{
        const token = localStorage.getItem('token');
        return new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      }

      getAllEvents(): Observable<any> {
            const headers = this.getHeaders();
            return this.http.get<any>(`${this.baseUrl}/api/v1/events`, { headers }).pipe(
              tap((response: { _embedded: any[] }) => {  // Correctly type the response
                const currentState = this.eventSubject.value;
                const events = response._embedded || [];  // Ensure it's an array
                this.eventSubject.next({ ...currentState, events });
              })
            );
          }



  // getAllEvents(): Observable<Event[]> {
  //   return this.http.get<Event[]>(`${this.baseUrl}/events`);
  // }

  // getEventById(id: string): Observable<Event> {
  //   return this.http.get<Event>(`${this.baseUrl}/events/${id}`);
  // }

  

  // // getUniqueLocations(): Observable<string[]> {
  // //   return this.getAllEvents().pipe(
  // //     map(events => Array.from(new Set(events.map(event => event.location))))
  // //   );
  // // }

  
  // getEventsByManager(managerId: string): Observable<Event[]> {
  //   return this.http.get<Event[]>(`${this.baseUrl}/events/manager/${managerId}`, { headers: this.getAuthHeaders() });
  // }

  // createEvent(event: Event): Observable<Event> {
  //   return this.http.post<Event>(`${this.baseUrl}/events`, event, { headers: this.getAuthHeaders() });
  // }

  // updateEvent(id: string, event: Event): Observable<Event> {
  //   console.log('Update Event Payload:', event); 
  //   return this.http.put<Event>(`${this.baseUrl}/events/${id}`, event, { headers: this.getAuthHeaders() });
  // }

  // deleteEvent(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.baseUrl}/events/${id}`, { headers: this.getAuthHeaders() });
  // }
}
