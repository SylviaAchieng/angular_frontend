import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReplyService {

  private baseUrl = 'http://localhost:8000'
        
        constructor(private http : HttpClient) {}
      
        replySubject = new BehaviorSubject<any>({
              replys: [],
              loading: false,
              newReply: null
            });
        
            private getHeaders(): HttpHeaders{
              const token = localStorage.getItem('token');
              return new HttpHeaders({
                Authorization: `Bearer ${localStorage.getItem('token')}`
              })
            }
  
        createReply(reply:any):Observable<any>{
              const headers = this.getHeaders();
              return this.http.post<any>(`${this.baseUrl}/api/v1/comment`,reply, {headers}).pipe(
                tap((newReply)=>{
                  const currentState = this.replySubject.value;
                  this.replySubject.next({...currentState, replys:
                    [newReply, ...currentState.replys]
                  });
                })
              );
            }

            getAllReplys(): Observable<any> {
              const headers = this.getHeaders();
              return this.http.get<any>(`${this.baseUrl}/api/v1/comment`, {headers}).pipe(
                tap((response: { _embedded: any[] }) => {  // Correctly type the response
                  const currentState = this.replySubject.value;
                  const replys = response._embedded || [];  // Ensure it's an array
                  this.replySubject.next({ ...currentState, replys });
                })
              );
            } 

            deleteReply(commentId: number): Observable<any> {
              const headers = this.getHeaders();
              return this.http.delete(`${this.baseUrl}/api/v1/comment/${commentId}`, { headers });
            }      
}
