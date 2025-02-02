import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  @Output() selectSection = new EventEmitter<string>();
  onSelectSection(section: string){
    this.selectSection.emit(section);
  }

}
