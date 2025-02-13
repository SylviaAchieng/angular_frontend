import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private baseUrl = 'http://localhost:8000'
    
    constructor(private http : HttpClient) {}
  
    locationSubject = new BehaviorSubject<any>({
          locations: [],
          loading: false,
          newLocation: null
        });
    
        private getHeaders(): HttpHeaders{
          const token = localStorage.getItem('token');
          return new HttpHeaders({
            Authorization: `Bearer ${localStorage.getItem('token')}`
          })
        }

        getAllLocations(): Observable<any> {
                    //const headers = this.getHeaders();
                    return this.http.get<any>(`${this.baseUrl}/api/v1/location`).pipe(
                      tap((response: { _embedded: any[] }) => {  // Correctly type the response
                        const currentState = this.locationSubject.value;
                        const Locations = response._embedded || [];  // Ensure it's an array
                        this.locationSubject.next({ ...currentState, Locations });
                      })
                    );
                  }
}
