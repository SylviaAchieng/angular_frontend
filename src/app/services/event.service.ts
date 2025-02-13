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
        newEvent: null
      });
  
      private getHeaders(): HttpHeaders{
        const token = localStorage.getItem('token');
        return new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      }

      getAllEvents(): Observable<any> {
            //const headers = this.getHeaders();
            return this.http.get<any>(`${this.baseUrl}/api/v1/events`).pipe(
              tap((response: { _embedded: any[] }) => {  // Correctly type the response
                const currentState = this.eventSubject.value;
                const events = response._embedded || [];  // Ensure it's an array
                this.eventSubject.next({ ...currentState, events });
              })
            );
          }

          createEvent(event:any):Observable<any>{
            const headers = this.getHeaders();
            return this.http.post<any>(`${this.baseUrl}/api/v1/events`,event, {headers}).pipe(
              tap((newEvent)=>{
                const currentState = this.eventSubject.value;
                this.eventSubject.next({...currentState, events:
                  [newEvent, ...currentState.events]
                });
              })
            );
          }    

          updateEvent(event:any):Observable<any>{
            const headers = this.getHeaders();
            return this.http.put<any>(`${this.baseUrl}/api/v1/events/${event.eventId}`,event, {headers}).pipe(
              tap((updatedEvent:any)=>{
                const currentState = this.eventSubject.value;
                const updatedEvents = currentState.events.map((item:any)=>item.eventId === updatedEvent.eventId?updatedEvent:item);
                this.eventSubject.next({...currentState, events: updatedEvents})
              })
            )
          }
      
          deleteEvent(eventId:any):Observable<any>{
            const headers = this.getHeaders();
            return this.http.delete<any>(`${this.baseUrl}/api/v1/events/${eventId}`, {headers}).pipe(
              tap((deletedEvent:any)=>{
                const currentState = this.eventSubject.value;
                const updatedEvents = currentState.events.filter((item:any)=>item.eventId !== eventId);
                this.eventSubject.next({...currentState, events: updatedEvents})
              })
            )
          }
      
          getEventById(eventId: any):Observable<any>{
            const headers = new HttpHeaders({
              Authorization: `Bearer ${localStorage.getItem('token')}`
            })
            return this.http.get<any>(`${this.baseUrl}/api/v1/events/${eventId}`, {headers}).pipe(
              tap((event)=>{
                console.log("event info", event)
                const currentState = this.eventSubject.value;
                this.eventSubject.next({...currentState, event})
              })
            )
          }  


}
