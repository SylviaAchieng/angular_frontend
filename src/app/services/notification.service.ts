import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'http://localhost:8000'

  constructor(private http: HttpClient) { }

  notificationSubject = new BehaviorSubject<any>({
    notifications: [],
    loading: false,
    newNotification: null
  });

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      Accept: 'application/json'
    })
  }

  getNotificationsByLocationId(locationId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}/api/v1/notifications/location/${locationId}`, { headers }).pipe(
      tap((response: { _embedded: any[] }) => {
        const currentState = this.notificationSubject.value;
        const notifications = response._embedded || [];
        this.notificationSubject.next({ ...currentState, notifications });
      })
    );
  }
}
