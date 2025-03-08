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
            const headers = this.getHeaders();
            return this.http.get<any>(`${this.baseUrl}/api/v1/issue/location/${locationId}`, {headers}).pipe(
              tap((response: { _embedded: any[] }) => {
                const currentState = this.issueSubject.value;
                const issues = response._embedded || [];
                this.issueSubject.next({ ...currentState, issues });
              })
            );
          }

          getAllIssues(): Observable<any> {
            const headers = this.getHeaders();
            return this.http.get<any>(`${this.baseUrl}/api/v1/issue`, {headers}).pipe(
              tap((response: { _embedded: any[] }) => {  // Correctly type the response
                const currentState = this.issueSubject.value;
                const issues = response._embedded || [];  // Ensure it's an array
                this.issueSubject.next({ ...currentState, issues });
              })
            );
          }

          updateIssue(issue:any):Observable<any>{
            const headers = this.getHeaders();
            return this.http.put<any>(`${this.baseUrl}/api/v1/issue/${issue.issueId}`,issue, {headers}).pipe(
              tap((updatedIssue:any)=>{
                const currentState = this.issueSubject.value;
                const updatedIssues = currentState.issues.map((item:any)=>item.issueId === updatedIssue.issueId?updatedIssue:item);
                this.issueSubject.next({...currentState, issues: updatedIssues})
              })
            )
          }

          getIssuesByStatus(status:string):Observable<any>{
            const headers = this.getHeaders();
            return this.http.get<any>(`${this.baseUrl}/api/v1/issue/status/${status}`, {headers}).pipe(
              tap((response: { _embedded: any[] }) => {
                const currentState = this.issueSubject.value;
                const issues = response._embedded || [];
                this.issueSubject.next({ ...currentState, issues });
              })
            );
          }

          getIssuesByUserId(userId:number):Observable<any>{
            return this.http.get<any>(`${this.baseUrl}/api/v1/issue/user/${userId}`).pipe(
              tap((response: { _embedded: any[] }) => {
                const currentState = this.issueSubject.value;
                const issues = response._embedded || [];
                this.issueSubject.next({ ...currentState, issues });
              })
            );
          }


}
