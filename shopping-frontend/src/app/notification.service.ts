import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SwPush } from "@angular/service-worker";



@Injectable({ providedIn: 'root' })
export class NotificationService {
    private readonly VAPID_PUBLIC_KEY = 'PUBLIC_KEY';

    constructor(private swPush: SwPush, private http: HttpClient) { }
    
    subscribeToNotifications(userId: string) {
    return this.swPush.requestSubscription({
      serverPublicKey: this.VAPID_PUBLIC_KEY
    }).then(subscription => {
      return this.http.post('/api/notifications/subscribe', {
        userId,
        subscription
      });
    });
    }
    
    listenForMessages() {
    this.swPush.messages.subscribe((message: any) => {
      console.log('Push message received:', message);
    });
    }
    
    listenForNotificationClicks() {
    this.swPush.notificationClicks.subscribe(({ notification }) => {
      console.log('Notification clicked:', notification);
    });
  }
}