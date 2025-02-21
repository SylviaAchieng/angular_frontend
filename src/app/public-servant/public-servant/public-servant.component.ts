import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-servant',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './public-servant.component.html',
  styleUrl: './public-servant.component.css'
})
export class PublicServantComponent {

}
