import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule, Router } from '@angular/router';
import { EventService, Event } from '../../core/services/event/event.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit() {
    this.eventService.getEvents()
      .subscribe((data) => {
        this.events = data.sort((a, b) => a.endDate - b.endDate);
      });
  }

  navigateToEvent(eventId: string) {
    this.router.navigate(['/event', eventId]);
  }
}
