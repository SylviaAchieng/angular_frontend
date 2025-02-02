import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations'; 

bootstrapApplication(AppComponent,{
  providers: [provideHttpClient(), provideRouter(routes),provideNoopAnimations()] // Register HttpClient here
}).catch(err => console.error(err));
