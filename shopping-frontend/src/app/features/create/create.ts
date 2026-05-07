import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShoppingService } from '../shopping.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create.html',
  styleUrl: './create.css',
})
export class Create {
  text = '';
  tag = '';
  quantity = 1;

  constructor(private service: ShoppingService) {}

  addItem(): void {
    if (!this.text.trim()) return;

    const itemText = this.text;
    const tagText = this.text;
    const amount = this.quantity;

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
