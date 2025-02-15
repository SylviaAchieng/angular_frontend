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


@Component({
  selector: 'app-all-discussions',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, MatTableModule, MatPaginatorModule, RouterLink, FooterComponent],
  templateUrl: './all-discussions.component.html',
  styleUrl: './all-discussions.component.css'
})
export class AllDiscussionsComponent {

  constructor(private router: Router, private discussionService: DiscussionService){
    this.categories.forEach(cat => this.categoryOpen[cat.name] = false);
  }

  searchQuery: string = '';
  discussions: any[]=[];
  filteredDiscussions: any[] = [];
  selectedCategory: string | null = null;
  paginatedDiscussions: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;



  categories = [
    { name: 'HEALTH_CARE', subcategories: ['General Health', 'One Community Centre', 'Community Cancer Fight', 'Free Medicine Community Centre'] },
    { name: 'COMMUNITY', subcategories: ['Young Generations', 'GENZ'] },
    { name: 'EDUCATION', subcategories: ['Higher Learning', 'Skill Development', 'Scholarships'] },
    { name: 'ENVIRONMENT', subcategories: ['Climate Action', 'Sustainability', 'Recycling'] }
  ];

  toggleDiscussionForm(){
    this.router.navigate(['create-discussion']);
  }

  ngOnInit(): void {
    this.getAllDiscussions();
  }

  categoryOpen: { [key: string]: boolean } = {};

  toggleCategory(category: string) {
    this.categoryOpen[category] = !this.categoryOpen[category];
  }
  

  getAllDiscussions() {
    this.discussionService.getAllDiscussions().subscribe({
      next: (response: any) => {
        this.discussions = response._embedded || [];
        this.filteredDiscussions = [...this.discussions];
      },
      error: err => console.error('Error fetching discussions:', err)
    });
  }

  onSearch() {
    this.filteredDiscussions = this.discussions.filter((discussion: any) =>
      discussion.category?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;  // Store the selected category

    this.discussionService.getDiscussionsByCategory(category).subscribe({
      next: (response: any) => {
        this.discussions = response._embedded || [];
        this.filterDiscussions();  // Ensure UI updates correctly
      },
      error: err => console.error('Error fetching discussions by category:', err)
    });
  }

  filterDiscussions() {
    this.filteredDiscussions = this.discussions.filter((discussion: any) => {
      const matchesSearch = this.searchQuery
        ? discussion.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        : true;
      const matchesCategory = this.selectedCategory
        ? discussion.category === this.selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
  }

  updatePaginatedDiscussions() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedDiscussions = this.discussions.slice(startIndex, startIndex + this.itemsPerPage);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedDiscussions();
    }
  }
  
}

