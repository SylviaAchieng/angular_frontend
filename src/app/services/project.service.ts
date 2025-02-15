// project.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private baseUrl = 'http://localhost:8000'
  
  constructor(private http : HttpClient) {}

  projectSubject = new BehaviorSubject<any>({
      projects: [],
      loading: false,
      newProject: null
    });

    private getHeaders(): HttpHeaders{
      const token = localStorage.getItem('token');
      return new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    }

    // getProjects():Observable<any>{
    //   const headers = this.getHeaders();
    //   return this.http.get<any[]>(`${this.baseUrl}/api/v1/projects`, {headers}).pipe(
    //     tap((projects)=>{
    //       const currentState = this.projectSubject.value;
    //       this.projectSubject.next({...currentState, projects});
    //     })
    //   );
    // }

    getProjects(): Observable<any> {
      //const headers = this.getHeaders();
      return this.http.get<any>(`${this.baseUrl}/api/v1/projects`).pipe(
        tap((response: { _embedded: any[] }) => {  // Correctly type the response
          const currentState = this.projectSubject.value;
          const projects = response._embedded || [];  // Ensure it's an array
          this.projectSubject.next({ ...currentState, projects });
        })
      );
    }

    getAllProjects(): Observable<any> {
      //const headers = this.getHeaders();
      return this.http.get<any>(`${this.baseUrl}/api/v1/projects`).pipe(
        tap((response: { _embedded: any[] }) => {  // Correctly type the response
          const currentState = this.projectSubject.value;
          const projects = response._embedded || [];  // Ensure it's an array
          this.projectSubject.next({ ...currentState, projects });
        })
      );
    }

    createProject(project:any):Observable<any>{
      const headers = this.getHeaders();
      return this.http.post<any>(`${this.baseUrl}/api/v1/projects`,project, {headers}).pipe(
        tap((newProject)=>{
          const currentState = this.projectSubject.value;
          this.projectSubject.next({...currentState, projects:
            [newProject, ...currentState.projects]
          });
        })
      );
    }

    updateProject(project:any):Observable<any>{
      const headers = this.getHeaders();
      return this.http.put<any>(`${this.baseUrl}/api/v1/projects/${project.projectId}`,project, {headers}).pipe(
        tap((updatedProject:any)=>{
          const currentState = this.projectSubject.value;
          const updatedProjects = currentState.projects.map((item:any)=>item.projectId === updatedProject.projectId?updatedProject:item);
          this.projectSubject.next({...currentState, projects: updatedProjects})
        })
      )
    }

    deleteProject(projectId:any):Observable<any>{
      const headers = this.getHeaders();
      return this.http.delete<any>(`${this.baseUrl}/api/v1/projects/${projectId}`, {headers}).pipe(
        tap((deletedProject:any)=>{
          const currentState = this.projectSubject.value;
          const updatedProjects = currentState.projects.filter((item:any)=>item.projectId !== projectId);
          this.projectSubject.next({...currentState, projects: updatedProjects})
        })
      )
    }

    getProjectById(projectId: any):Observable<any>{
      const headers = new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
      return this.http.get<any>(`${this.baseUrl}/api/v1/projects/${projectId}`, {headers}).pipe(
        tap((project)=>{
          console.log("project info", project)
          const currentState = this.projectSubject.value;
          this.projectSubject.next({...currentState, project})
        })
      )
    }

    likeProject(projectId:any):Observable<any>{
      const headers = this.getHeaders();
      return this.http.put<any>(`${this.baseUrl}/api/v1/projects/${projectId}/like`, {headers}).pipe(
        tap((updatedProject:any)=>{
          const currentState = this.projectSubject.value;
          const updatedProjects = currentState.projects.map((item:any)=>item.projectId === updatedProject.projectId?updatedProject:item);
          this.projectSubject.next({...currentState, projects: updatedProjects})
        })
      )
    }



}
