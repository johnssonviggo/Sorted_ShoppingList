import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ShoppingItem } from '../shopping-item';
import { ShoppingService } from '../shopping.service';

@Component({
  selector: 'app-show',
  standalone: true,
  imports: [],
  templateUrl: './show.html',
  styleUrl: './show.css',
})
export class Show implements OnInit {
  items: ShoppingItem[] = [];
  groupedItems: { [tag: string]: ShoppingItem[] } = {};
  objectKeys = Object.keys;

  constructor(private service: ShoppingService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.service.refresh$.subscribe(() => {
      this.loadItems();
    });
    this.loadItems();
  }

  loadItems(): void {
    this.service.getItems().subscribe(items => {
      this.items = items;
      this.groupByTag(items);
      this.cdr.markForCheck();
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