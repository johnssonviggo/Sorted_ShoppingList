import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ShoppingItem } from './shopping-item';

@Injectable({
  providedIn: 'root'
})
export class ShoppingService {
  private apiUrl = `http://${window.location.hostname}:8080/api/shopping`;
  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) {}

  triggerRefresh(): void {
    this.refreshSubject.next();
  }

  getItems(): Observable<ShoppingItem[]> {
    return this.http.get<ShoppingItem[]>(this.apiUrl);
  }

  createItem(text: string, tag: string, quantity: number): Observable<ShoppingItem> {
    return this.http.post<ShoppingItem>(this.apiUrl, { text, tag, quantity, complete: false });
  }

  updateItem(item: ShoppingItem): Observable<ShoppingItem> {
    return this.http.patch<ShoppingItem>(`${this.apiUrl}/${item.id}`, item);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}