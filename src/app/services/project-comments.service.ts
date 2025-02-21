import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectCommentsService {

  private baseUrl = 'http://localhost:8000'
            
            constructor(private http : HttpClient) {}
          
            commentsSubject = new BehaviorSubject<any>({
                  comments: [],
                  loading: false,
                  newComments: null
                });
            
                private getHeaders(): HttpHeaders{
                  const token = localStorage.getItem('token');
                  return new HttpHeaders({
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                  })
                }
      
            createComment(comment:any):Observable<any>{
                  const headers = this.getHeaders();
                  return this.http.post<any>(`${this.baseUrl}/api/v1/project-comments`,comment, {headers}).pipe(
                    tap((newComment)=>{
                      const currentState = this.commentsSubject.value;
                      this.commentsSubject.next({...currentState, comments:
                        [newComment, ...currentState.comments]
                      });
                    })
                  );
                }

                getCommentsByProjectId(projectId: number): Observable<any> {
                  //const headers = this.getHeaders();
                  return this.http.get<any>(`${this.baseUrl}/api/v1/project-comments/${projectId}`).pipe(
                    tap((response: { _embedded: any[] }) => {  // Correctly type the response
                      const currentState = this.commentsSubject.value;
                      const comments = response._embedded || [];  // Ensure it's an array
                      this.commentsSubject.next({ ...currentState, comments });
                    })
                  );
                }

}
