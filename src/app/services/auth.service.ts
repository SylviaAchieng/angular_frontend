import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8000'

  constructor(private http : HttpClient) {}

  private getHeaders(): HttpHeaders{
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    })
  }

  // login(email: string, password: string): Observable<any>{
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   const body = { email, password };
  //   return this.http.post(`http://localhost:8000/api/v1/users/auth`, body,{headers})
  // }


  authSubject = new BehaviorSubject<any>({
    user:null
  });
  user$ = this.authSubject.asObservable();

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email, password };

    return this.http.post(`${this.baseUrl}/api/v1/users/auth`, body, { headers }).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user)); // Store user

        this.authSubject.next(response.user); // Update global state
      })
    );
  }

  register(userData:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/api/v1/users`, userData);
  }

   getUserProfile(userId: any):Observable<any>{
     const headers = new HttpHeaders({
       Authorization: `Bearer ${localStorage.getItem('token')}`
     })
     return this.http.get<any>(`${this.baseUrl}/api/v1/users/${userId}`, {headers}).pipe(
       tap((user)=>{
         console.log("get user profile", user)
         const currentState = this.authSubject.value;
         this.authSubject.next({...currentState, user})
       })
     )
   }

  
  

  getAllUsers(): Observable<any> {
    //const headers = this.getHeaders();
    return this.http.get<any>(`${this.baseUrl}/api/v1/users`).pipe(
      tap((response: { _embedded: any[] }) => {  // Correctly type the response
        const currentState = this.authSubject.value;
        const users = response._embedded || [];  // Ensure it's an array
        this.authSubject.next({ ...currentState, users });
      })
    );
  }

  deleteUser(userId:any):Observable<any>{
    const headers = this.getHeaders();
    return this.http.delete<any>(`${this.baseUrl}/api/v1/users/${userId}`, {headers}).pipe(
      tap((deletedUser:any)=>{
        const currentState = this.authSubject.value;
        const updatedUser = currentState.users.filter((item:any)=>item.userId !== userId);
        this.authSubject.next({...currentState, users: updatedUser})
      })
    )
  }

  updateUser(userId:any, userData:any):Observable<any>{
    const headers = this.getHeaders();
      return this.http.put<any>(`${this.baseUrl}/api/v1/users/${userId}`,userData, {headers}).pipe(
        tap((updatedUser:any)=>{
          const currentState = this.authSubject.value;
          const updatedUsers = currentState.users.map((item:any)=>item.userId === updatedUser.userId?updatedUser:item);
          this.authSubject.next({...currentState, users: updatedUsers})
        })
      )
  }

  getUser() {
    return this.authSubject.value; // Get current user
  }

  // Initialize user from localStorage on load
  initializeUser() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.authSubject.next(JSON.parse(storedUser));
    }
  }

  logout(){
    localStorage.clear();
    this.authSubject.next({})
  }

}
