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

  @HostBinding('class.notification') public readonly notification = true;

  notifications: { text: string; time: string; icon: string; color: string }[] = [];

  constructor(notificationService: NotificationService) {
    this.notifications = notificationService.getNotifications();
  }

}
