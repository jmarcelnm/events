import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EventService, EventInfo, Session } from '../../core/services/event/event.service';
import { ShoppingCartService } from '../../core/services/shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  eventInfo: EventInfo | null = null;
  selectedSeats: { [sessionId: number]: number } = {};

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private shoppingCartService: ShoppingCartService
  ) { }

  get sortedSessions(): Session[] {
    return this.eventInfo?.sessions.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];
  }

  ngOnInit() {
    const eventId: string | null = this.route.snapshot.paramMap.get('id');

    if (eventId) {
      this.eventService.getEventInfo(eventId)
        .subscribe((data) => {
          this.eventInfo = data;
        });

      this.shoppingCartService.cart$
        .subscribe((cart: { [key: string]: { sessionId: number; quantity: number }[] }) => {
          this.selectedSeats = cart[eventId]
            ? cart[eventId]
              .reduce((
                acc: { [sessionId: number]: number },
                session: { sessionId: number; quantity: number }
              ) => {
                acc[session.sessionId] = session.quantity;
                return acc;
              }, {})
            : {};
        });
    }
  }

  addToCart(sessionId: number) {
    if (this.eventInfo && this.getAvailableSeats(sessionId) > 0) {
      this.shoppingCartService.addToCart(Number(this.eventInfo.event.id), sessionId);
    }
  }

  removeFromCart(sessionId: number) {
    if (this.eventInfo && (this.selectedSeats[sessionId] || 0) > 0) {
      this.shoppingCartService.removeFromCart(Number(this.eventInfo.event.id), sessionId);
    }
  }

  getAvailableSeats(sessionId: number): number {
    const originalAvailability = this.eventInfo?.sessions.find(session => session.date === sessionId)?.availability || 0;
    const selectedSeats = this.selectedSeats[sessionId] || 0;
    return originalAvailability - selectedSeats;
  }

  getSessionAvailability(sessionId: number): number {
    return this.eventInfo?.sessions.find(session => session.date === sessionId)?.availability || 0;
  }

  isMaxSelected(session: Session): boolean {
    return (this.selectedSeats[session.date] || 0) >= this.getAvailableSeats(session.date);
  }

  isMinSelected(session: Session): boolean {
    return (this.selectedSeats[session.date] || 0) <= 0;
  }
}
