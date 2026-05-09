import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ShoppingItem } from '../shopping-item';
import { ShoppingService } from '../shopping.service';
import { Create } from "../create/create";
import { WebSocketService } from '../../websocket.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-show',
  standalone: true,
  imports: [Create, CommonModule],
  templateUrl: './show.html',
  styleUrl: './show.css',
})
export class Show implements OnInit {
  items: ShoppingItem[] = [];
  groupedItems: { [tag: string]: ShoppingItem[] } = {};
  objectKeys = Object.keys;
  menuOpen = false;
  initials = '';
  colorOptions = ['#B5D4F4', '#9FE1CB', '#F5C4B3', '#F4C0D1', '#FAC775', '#C0DD97'];
  tagColors: { [tag: string]: string } = {};

  constructor(
    private service: ShoppingService,
    private cdr: ChangeDetectorRef,
    private ws: WebSocketService,
    private auth: AuthService,
    private router: Router,
    private notifications: NotificationService
  ) {
    const username = localStorage.getItem('username') || 'U';
    this.initials = username.slice(0, 2).toUpperCase();
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.loadItems();
    }
    this.service.refresh$.subscribe(() => this.loadItems());
    this.ws.updates$.subscribe(() => this.loadItems());
  }

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }

  getTagColor(tag: string): string {
    if (!this.tagColors[tag]) {
      const index = Object.keys(this.tagColors).length % this.colorOptions.length;
      this.tagColors[tag] = this.colorOptions[index];
    }
    return this.tagColors[tag];
  }

  setTagColor(tag: string, color: string): void {
    this.tagColors[tag] = color;
  }

  disableNotifications(): void {
  // placeholder for disabling
    alert('Notifications disabled');
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