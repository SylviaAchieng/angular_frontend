import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  private baseUrl = 'http://localhost:8000'
      
      constructor(private http : HttpClient) {}
    
      discussionSubject = new BehaviorSubject<any>({
            discussions: [],
            loading: false,
            newDiscussion: null
          });
      
          private getHeaders(): HttpHeaders{
            const token = localStorage.getItem('token');
            return new HttpHeaders({
              Authorization: `Bearer ${localStorage.getItem('token')}`
            })
          }

      createDiscussion(discussion:any):Observable<any>{
            const headers = this.getHeaders();
            return this.http.post<any>(`${this.baseUrl}/api/v1/discussions`,discussion, {headers}).pipe(
              tap((newDiscussion)=>{
                const currentState = this.discussionSubject.value;
                this.discussionSubject.next({...currentState, discussions:
                  [newDiscussion, ...currentState.discussions]
                });
              })
            );
          } 

          getAllDiscussions(): Observable<any> {
            //const headers = this.getHeaders();
            return this.http.get<any>(`${this.baseUrl}/api/v1/discussions`).pipe(
              tap((response: { _embedded: any[] }) => {  // Correctly type the response
                const currentState = this.discussionSubject.value;
                const discussions = response._embedded || [];  // Ensure it's an array
                this.discussionSubject.next({ ...currentState, discussions });
              })
            );
          }    

          getDiscussionById(discussionId: any): Observable<any> {
            const headers = new HttpHeaders({
              Authorization: `Bearer ${localStorage.getItem('token')}`
            });
        
            const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
            const url = `${this.baseUrl}/api/v1/discussions/${discussionId}?userId=${userId}`; // Include userId in request
        
            return this.http.get<any>(url, { headers }).pipe(
              tap((discussion) => {
                console.log("Discussion info", discussion);
                const currentState = this.discussionSubject.value;
                this.discussionSubject.next({ ...currentState, discussion });
              })
            );
        }

        getDiscussionsByCategory(category: string): Observable<any> {
          const headers = this.getHeaders();
          return this.http.get<any>(`${this.baseUrl}/api/v1/discussions/category/${category}`, {headers}).pipe(
            tap((response: { _embedded: any[] }) => {
              const currentState = this.discussionSubject.value;
              const discussions = response._embedded || [];
              this.discussionSubject.next({ ...currentState, discussions });
            })
          );
        }
        
        

}
