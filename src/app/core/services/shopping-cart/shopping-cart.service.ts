import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private cartKey = 'eventCart';
  private cart = new BehaviorSubject<{ [eventId: number]: { sessionId: number; quantity: number }[] }>
    (
      this.loadCartFromLocalStorage()
    );

  cart$ = this.cart.asObservable();

  constructor() {
    this.cart$.subscribe(cart => this.saveCartToLocalStorage(cart));
  }

  private loadCartFromLocalStorage(): { [eventId: number]: { sessionId: number; quantity: number }[] } {
    const storedCart = localStorage.getItem(this.cartKey);
    return storedCart ? JSON.parse(storedCart) : {};
  }

  private saveCartToLocalStorage(cart: { [eventId: number]: { sessionId: number; quantity: number }[] }) {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }

  addToCart(eventId: number, sessionId: number) {
    const currentCart = this.cart.value;

    if (!currentCart[eventId]) {
      currentCart[eventId] = [];
    }

    const session = currentCart[eventId].find(s => s.sessionId === sessionId);

    if (session) {
      session.quantity += 1;
    } else {
      currentCart[eventId].push({ sessionId, quantity: 1 });
    }

    this.cart.next({ ...currentCart });
  }

  removeFromCart(eventId: number, sessionId: number) {
    const currentCart = this.cart.value;

    if (currentCart[eventId]) {
      const sessionIndex = currentCart[eventId].findIndex(s => s.sessionId === sessionId);

      if (sessionIndex !== -1) {
        currentCart[eventId][sessionIndex].quantity -= 1;

        if (currentCart[eventId][sessionIndex].quantity <= 0) {
          currentCart[eventId].splice(sessionIndex, 1);
        }

        if (currentCart[eventId].length === 0) {
          delete currentCart[eventId];
        }

        this.cart.next({ ...currentCart });
      }
    }
  }
}
