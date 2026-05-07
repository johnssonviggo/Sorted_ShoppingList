import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ShoppingItem } from '../shopping-item';
import { ShoppingService } from '../shopping.service';
import { Create } from "../create/create";
import { WebSocketService } from '../../websocket.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../notification.service';

@Component({
  selector: 'app-show',
  standalone: true,
  imports: [Create],
  templateUrl: './show.html',
  styleUrl: './show.css',
})
export class Show implements OnInit {
  items: ShoppingItem[] = [];
  groupedItems: { [tag: string]: ShoppingItem[] } = {};
  objectKeys = Object.keys;

  constructor(
    private service: ShoppingService,
    private cdr: ChangeDetectorRef,
    private ws: WebSocketService,
    private auth: AuthService,
    private router: Router,
    private notifications: NotificationService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.loadItems();
    }
    this.service.refresh$.subscribe(() => this.loadItems());
    this.ws.updates$.subscribe(() => this.loadItems());
  }

  enableNotifications(): void {
    console.log('Permission status:', Notification.permission);
    
    Notification.requestPermission().then(permission => {
        console.log('Permission result:', permission);
        if (permission === 'granted') {
            this.notifications.subscribeToNotifications('user')
                .then(() => console.log('Subscribed!'))
                .catch(err => console.error('Failed:', err));
        } else {
            alert('Please allow notifications in your browser settings');
        }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  loadItems(): void {
    this.service.getItems().subscribe(items => {
      this.items = items;
      this.groupByTag(items);
      this.cdr.detectChanges();
    });
  }

  groupByTag(items: ShoppingItem[]): void {
    this.groupedItems = items.reduce((acc, item) => {
      const tag = item.tag || 'Other';
      (acc[tag] ??= []).push(item);
      return acc;
    }, {} as { [tag: string]: ShoppingItem[] });
  }

  toggle(item: ShoppingItem): void {
    this.service.updateItem({ ...item, complete: !item.complete }).subscribe(() => {
      this.loadItems();
    });
  }

  delete(id: number): void {
    this.service.deleteItem(id).subscribe(() => {
      this.loadItems();
    });
  }
}