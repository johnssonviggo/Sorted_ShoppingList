import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SwPush } from "@angular/service-worker";



@Injectable({ providedIn: 'root' })
export class NotificationService {
    readonly VAPID_PUBLIC_KEY = 'BDhxI6e-UBpAr2OK2WKeuOb6oW9LinJ2xwqIfBJ2nRQNhQnV8Mp2DvrUAwWk0IEj4FT9iuXk3s8OBcpFgfpmivQ';

  constructor(
    private swPush: SwPush,
    private http: HttpClient) { }
    
    subscribeToNotifications(userId: string): Promise<void> {
      return this.swPush.requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY
      }).then(subscription => {
          return this.http.post('/api/notifications/subscribe', {
              userId,
              subscription
          }).toPromise().then(() => {});
      });
    }
    
    listenForMessages() {
      this.swPush.messages.subscribe((message: any) => {
        alert(`Push message received: ${message}`);
      });
    }
    
    listenForNotificationClicks() {
      this.swPush.notificationClicks.subscribe(({ notification }) => {
        console.log('Notification clicked:', notification);
      });
    }
}