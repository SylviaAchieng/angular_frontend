import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  public getNotifications(): { text: string; time: string; icon: string; color: string }[]  {
    return [
      {
        text: 'You have 3 new orders.',
        time: 'just now',
        icon: 'plus_one',
        color: 'primary',
      }, {
        text: 'Database error',
        time: '1 min',
        icon: 'error_outline',
        color: 'secondary',
      }, {
        text: 'The Death Star is built!',
        time: '2 hours',
        icon: 'new_releases',
        color: 'primary',
      }, {
        text: 'You have 4 new mails.',
        time: '5 days',
        icon: 'mail_outline',
        color: 'primary',
      },
    ];
  }
}
