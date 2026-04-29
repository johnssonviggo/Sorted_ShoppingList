import { Component } from '@angular/core';
import { Create } from './features/create/create';
import { Show } from './features/show/show';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Create, Show],
  templateUrl: './app.html',
})
export class App {
  constructor(private notificationService: NotificationService) {
    this.notificationService.listenForMessages();
    this.notificationService.listenForNotificationClicks();
  }

  async enableNotification() {
    try {
      await this.notificationService.subscribeToNotifications('TempUserId')
      alert('Notifications enabled!');
    } catch (e) {
      console.error('Failed to subscribe', e);
      alert('Could not enable notifications. On iOS, make sure the app is installed to your Homescreen first.');
    }
  }
}