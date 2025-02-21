import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectLikesService {

  private baseUrl = 'http://localhost:8000'
          
          constructor(private http : HttpClient) {}
        
          likesSubject = new BehaviorSubject<any>({
                likes: [],
                loading: false,
                newLikes: null
              });
          
              private getHeaders(): HttpHeaders{
                const token = localStorage.getItem('token');
                return new HttpHeaders({
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                })
              }
    
          createLikes(like:any):Observable<any>{
                const headers = this.getHeaders();
                return this.http.post<any>(`${this.baseUrl}/api/v1/likes`,like, {headers}).pipe(
                  tap((newLike)=>{
                    const currentState = this.likesSubject.value;
                    this.likesSubject.next({...currentState, likes:
                      [newLike, ...currentState.likes]
                    });
                  })
                );
              }
  
              getLikesByProjectId(projectId: number): Observable<any> {
                //const headers = this.getHeaders();
                return this.http.get<any>(`${this.baseUrl}/api/v1/likes/${projectId}`).pipe(
                  tap((response: { _embedded: any[] }) => {  // Correctly type the response
                    const currentState = this.likesSubject.value;
                    const likes = response._embedded || [];  // Ensure it's an array
                    this.likesSubject.next({ ...currentState, likes });
                  })
                );
              }
}
