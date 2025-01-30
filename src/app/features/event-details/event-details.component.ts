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
    return this.eventInfo?.sessions.sort((a, b) => Number(a.date) - Number(b.date)) || [];
  }

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');

    if (eventId) {
      this.eventService.getEventInfo(eventId)
        .subscribe((data) => {
          this.eventInfo = data;
        });
    }
  }

  addToCart(sessionId: number) {
    if (this.eventInfo && !this.isMaxSelected({ date: sessionId, availability: this.getSessionAvailability(sessionId) })) {
      this.shoppingCartService.addToCart(Number(this.eventInfo.event.id), sessionId);
      this.selectedSeats[sessionId] = (this.selectedSeats[sessionId] || 0) + 1;
    }
  }

  removeFromCart(sessionId: number) {
    if (this.eventInfo && !this.isMinSelected({ date: sessionId, availability: this.getSessionAvailability(sessionId) })) {
      this.shoppingCartService.removeFromCart(Number(this.eventInfo.event.id), sessionId);
      this.selectedSeats[sessionId] = Math.max((this.selectedSeats[sessionId] || 0) - 1, 0);
    }
  }

  getSessionAvailability(sessionId: number): number {
    return this.eventInfo?.sessions.find(session => session.date === sessionId)?.availability || 0;
  }

  isMaxSelected(session: Session): boolean {
    return (this.selectedSeats[session.date] || 0) >= session.availability;
  }

  isMinSelected(session: Session): boolean {
    return (this.selectedSeats[session.date] || 0) <= 0;
  }
}
