import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShoppingService } from '../shopping.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create implements OnInit {
  text = '';
  tag = '';
  quantity = 1;
  existingTags: string[] = [];

  constructor(private service: ShoppingService) {}

  ngOnInit(): void {
    const saved = localStorage.getItem('tags');
    this.existingTags = saved ? JSON.parse(saved) : [];
  }

  addItem(): void {
    if (!this.text.trim()) return;

    const itemText = this.text;
    const tagText = this.tag;
    const amount = this.quantity;

    if (this.tag && !this.existingTags.includes(this.tag)) {
      this.existingTags.push(this.tag);
      localStorage.setItem('tags', JSON.stringify(this.existingTags));
    }

    this.service.createItem(this.text, this.tag, this.quantity).subscribe(() => {
      if (Notification.permission === 'granted') {
        new Notification('Item added!', {
          body: `${amount} ${itemText} was added to the shopping list at ${tagText}`,
          icon: '/favicon.ico'
        });
      }

      this.text = '';
      this.tag = '';
      this.quantity = 1;

      this.service.triggerRefresh();
    });
  }
}
