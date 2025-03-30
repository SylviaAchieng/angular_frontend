import { Component, HostBinding } from '@angular/core';
import { NotificationService } from '../../../../services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  @HostBinding('class') class = 'notification-component';
  constructor(private notificationService: NotificationService) {}
  notifications: any[] = [
    {
      id: 1,
      title: "New Customer Registered",
      message: "We're pleased to inform you that a new customer has registered! Please follow up promptly.",
      time: "Just Now",
      isFavorite: false,
      isRead: false,
    },
    {
      id: 2,
      title: "Special Offer",
      message: "Hello Sales Team, we have a special offer for our customers! Enjoy a 20% discount.",
      time: "30 minutes ago",
      isFavorite: true,
      isRead: false,
    },
    {
      id: 3,
      title: "Sales Reminder",
      message: "Reminder to achieve this month's sales target. Currently, we've...",
      time: "2 days ago",
      isFavorite: false,
      isRead: true,
    },
  ];

  activeTab: 'all' | 'archive' | 'favorite' = 'all';

  setTab(tab: 'all' | 'archive' | 'favorite') {
    this.activeTab = tab;
  }

  toggleFavorite(notification: Notification) {
    //notification.isFavorite = !notification.isFavorite;
  }

  deleteNotification(id: number) {
    this.notifications = this.notifications.filter((n) => n.id !== id);
  }
}
