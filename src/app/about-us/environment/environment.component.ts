import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-environment',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink],
  templateUrl: './environment.component.html',
  styleUrl: './environment.component.css'
})
export class EnvironmentComponent {
  currentIndex = 0;
  totalQuotes = 3; // Update if adding more quotes
  testimonials = [
    {
      quote: "We are a community of possibilities, not a community of problems. Community exists for the sake of belonging...",
      name: "Peter Block"
    },
    {
      quote: "What looked like a small patch of purple grass, above five feet square, was moving across...",
      name: "John Doe"
    },
    {
      quote: "Inclusive participation has never been easier. Go Vocal embraces diversity effortlessly.",
      name: "Maria Gonzalez"
    }
  ];

  showQuote(index: number) {
    this.currentIndex = index;
  }

  nextQuote() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  prevQuote() {
    this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

}
