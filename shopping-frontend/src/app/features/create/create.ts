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

    this.service.createItem(this.text, this.tag, this.quantity).subscribe(() => {
      this.text = '';
      this.tag = '';
      this.quantity = 1;
      this.service.triggerRefresh();
    });
  }
}
