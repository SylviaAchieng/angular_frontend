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

  getAllNotifications(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}/api/v1/notifications`, { headers }).pipe(
      tap((response: { _embedded: any[] }) => {  
        const currentState = this.notificationSubject.value;
        const notifications = response._embedded || []; 
        this.notificationSubject.next({ ...currentState, notifications });
      })
    );
  }

  markAllAsRead(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.baseUrl}/api/v1/notifications/mark-read`, {}, { headers }).pipe(
      tap(() => {
        const currentState = this.notificationSubject.value;
        this.notificationSubject.next({ ...currentState, notifications: [] });
      })
    );
  }

  getNotificationById(notificationId: number):Observable<any>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    })
    return this.http.get<any>(`${this.baseUrl}/api/v1/notifications/${notificationId}`, {headers}).pipe(
      tap((notification)=>{
        console.log("notification info", notification)
        const currentState = this.notificationSubject.value;
        this.notificationSubject.next({...currentState, notification})
      })
    )
  }

  deleteNotification(notificationId:number):Observable<any>{
    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.baseUrl}/api/v1/notifications/${notificationId}`, {headers}).pipe(
      tap((deletedNotificaton:any)=>{
        const currentState = this.notificationSubject.value;
        const updatedNotification = currentState.notifications.filter((item:any)=>item.notificationId !== notificationId);
        this.notificationSubject.next({...currentState, notifications: updatedNotification})
      })
    )
  }

}
