import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Event {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  place: string;
  startDate: number;
  endDate: number;
  description: string;
}

export interface Session {
  date: number;
  availability: number;
}

export interface EventInfo {
  event: Event;
  sessions: Session[];
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventsUrl = 'assets/mock-data/events.json';
  private eventInfoUrl = 'assets/mock-data/event-info.json';

  constructor(private http: HttpClient) { }

  getEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.eventsUrl);
  }

  getEventInfo(eventId: string): Observable<EventInfo | null> {
    return this.http.get<{ [key: string]: EventInfo }>(this.eventInfoUrl).pipe(map(data => data[eventId] || null));
  }
}
