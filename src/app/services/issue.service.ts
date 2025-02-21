import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  private baseUrl = 'http://localhost:8000'
    
    constructor(private http : HttpClient) {}
  
    issueSubject = new BehaviorSubject<any>({
        issues: [],
        loading: false,
        newIssue: null
      });
  
      private getHeaders(): HttpHeaders{
        const token = localStorage.getItem('token');
        return new HttpHeaders({
          Authorization: `Bearer ${localStorage.getItem('token')}`
        })
      }

      createIssue(issue:any):Observable<any>{
            const headers = this.getHeaders();
            return this.http.post<any>(`${this.baseUrl}/api/v1/issue`,issue, {headers}).pipe(
              tap((newIssue)=>{
                const currentState = this.issueSubject.value;
                this.issueSubject.next({...currentState, issues:
                  [newIssue, ...currentState.issues]
                });
              })
            );
          }

          getIssueByLocationId(locationId: number): Observable<any> {
            //const headers = this.getHeaders();
            return this.http.get<any>(`${this.baseUrl}/api/v1/issue/location/${locationId}`).pipe(
              tap((response: { _embedded: any[] }) => {
                const currentState = this.issueSubject.value;
                const issues = response._embedded || [];
                this.issueSubject.next({ ...currentState, issues });
              })
            );
          }
}
