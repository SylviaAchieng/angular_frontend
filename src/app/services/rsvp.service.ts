import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RsvpService {

  private baseUrl = 'http://localhost:8000'
          
          constructor(private http : HttpClient) {}
        
          rsvpSubject = new BehaviorSubject<any>({
                rsvps: [],
                loading: false,
                newRsvp: null
              });
          
              private getHeaders(): HttpHeaders{
                const token = localStorage.getItem('token');
                return new HttpHeaders({
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                })
              }
    
          addRSVP(rsvp:any):Observable<any>{
                const headers = this.getHeaders();
                return this.http.post<any>(`${this.baseUrl}/api/v1/rsvp`,rsvp, {headers}).pipe(
                  tap((newRsvp)=>{
                    const currentState = this.rsvpSubject.value;
                    this.rsvpSubject.next({...currentState, rsvps:
                      [newRsvp, ...currentState.rsvps]
                    });
                  })
                );
              }


              getAllRsvps(eventId: number): Observable<any> {
                const headers = this.getHeaders();
                return this.http.get<any>(`${this.baseUrl}/api/v1/rsvp/${eventId}`, {headers}).pipe(
                  tap((response: { _embedded: any[] }) => {  // Correctly type the response
                    const currentState = this.rsvpSubject.value;
                    const rsvps = response._embedded || [];  // Ensure it's an array
                    this.rsvpSubject.next({ ...currentState, rsvps });
                  })
                );
              } 

}
