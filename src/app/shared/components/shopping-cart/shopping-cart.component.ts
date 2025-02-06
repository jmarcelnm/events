import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EventService } from '../../../core/services/event/event.service';
import { ShoppingCartService } from '../../../core/services/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  cart: { [eventId: number]: { sessionId: number; quantity: number }[] } = {};
  eventTitles: { [eventId: string]: string } = {};
  isExpanded = false;

  constructor(private eventService: EventService, private shoppingCartService: ShoppingCartService) { }

  get cartKeys(): number[] {
    return Object.keys(this.cart).map(Number);
  }

  get totalItems(): number {
    return Object.values(this.cart)
      .flat()
      .reduce((sum, session) => sum + session.quantity, 0);
  }

  ngOnInit() {
    this.shoppingCartService.cart$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cartData) => {
        this.cart = cartData;
      });

    this.eventService.getEvents()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((events) => {
        this.eventTitles = events
          .reduce((acc, event) => {
            acc[event.id.toString()] = event.title;
            return acc;
          }, {} as { [eventId: string]: string });
      });
  }

  getEventTitle(eventId: number): string {
    return this.eventTitles[eventId] || 'Unknown Event';
  }

  removeFromCart(eventId: number, sessionId: number) {
    this.shoppingCartService.removeFromCart(eventId, sessionId);
  }

  toggleCart() {
    this.isExpanded = !this.isExpanded;
  }
}
