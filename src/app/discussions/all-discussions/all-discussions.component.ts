import { Component } from '@angular/core';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { Route, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { DiscussionService } from '../../services/discussion.service';
import { FooterComponent } from "../../components/footer/footer.component";

interface PeriodicElement {
  position: number;
  name: string;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  // Add more elements as needed
];

@Component({
  selector: 'app-all-discussions',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, MatTableModule, MatPaginatorModule, RouterLink, FooterComponent],
  templateUrl: './all-discussions.component.html',
  styleUrl: './all-discussions.component.css'
})
export class AllDiscussionsComponent {

  constructor(private router: Router, private discussionService: DiscussionService){}

  searchQuery: string = '';
  discussions: any[]=[];
  

  onSearch() {
    console.log("Searching for:", this.searchQuery);
    // Implement search logic here
  }

  toggleDiscussionForm(){
    this.router.navigate(['create-discussion']);
  }

  ngOnInit(): void {
    this.getAllDiscussions();
  }
  categoryOpen: { [key: string]: boolean } = {
    fifa17: false,
    community: false,
  };

  toggleCategory(category: string): void {
    this.categoryOpen[category] = !this.categoryOpen[category];
  }

  getAllDiscussions(){
    this.discussionService.getAllDiscussions().subscribe({
      next:(response: any)=>{
        this.discussionService.discussionSubject.subscribe(state => {
          this.discussions = state.discussions || [];
        });
      },
      error: err => console.error('Error fetching discussions:', err)

    })
  }

  
}

