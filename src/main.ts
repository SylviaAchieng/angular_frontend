import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app.routes';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; 
import{provideToastr} from 'ngx-toastr'

bootstrapApplication(AppComponent,{
  providers: [provideToastr(),provideHttpClient(), provideRouter(routes, withComponentInputBinding(),
    withViewTransitions(),), provideNoopAnimations(), provideAnimationsAsync()] // Register HttpClient here
}).catch(err => console.error(err));
