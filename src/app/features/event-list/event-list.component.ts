import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RouterModule, Router } from '@angular/router';
import { EventService, Event } from '../../core/services/event/event.service';
import { EventDetailsComponent } from '../event-details/event-details.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  events: Event[] = [];

  constructor(
    private eventService: EventService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.eventService.getEvents()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.events = data.sort((a, b) => a.endDate - b.endDate);
      });
  }

  navigateToEvent(eventId: string) {
    this.router.navigate(['/event', eventId]);
  }

  openEventDetails(eventId: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = { eventId };

    dialogConfig.maxHeight = '90vh';
    dialogConfig.width = '600px';

    this.dialog.open(EventDetailsComponent, dialogConfig);
  }

  truncateDescription(description: string, maxLength: number): string {
    return description.length > maxLength ? description.substring(0, maxLength) + '...' : description;
  }
}