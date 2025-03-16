import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  private baseUrl = 'http://localhost:8000'
    
    constructor(private http : HttpClient) {}
  
    contactSubject = new BehaviorSubject<any>({
          contacts: [],
          loading: false,
          newContact: null
        });
    
        private getHeaders(): HttpHeaders{
          const token = localStorage.getItem('token');
          return new HttpHeaders({
            Authorization: `Bearer ${localStorage.getItem('token')}`
          })
        }

        createMessage(contact:any):Observable<any>{
                    return this.http.post<any>(`${this.baseUrl}/api/v1/contact-us`,contact).pipe(
                      tap((newContact)=>{
                        const currentState = this.contactSubject.value;
                        this.contactSubject.next({...currentState, contacts:
                          [newContact, ...currentState.contacts]
                        });
                      })
                    );
                  }
}
