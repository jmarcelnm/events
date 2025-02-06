import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { EventListComponent } from './event-list.component';
import { EventService } from '../../core/services/event/event.service';
import { of } from 'rxjs';

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;
  let mockEventService: jasmine.SpyObj<EventService>;

  beforeEach(async () => {
    mockEventService = jasmine.createSpyObj('EventService', ['getEvents']);

    const mockEvents = [
      {
        id: '68',
        title: 'Music Concert',
        subtitle: 'Jazz and blues',
        image: '/assets/images/music.jpg',
        place: 'Palau de la Música Catalana, Barcelona',
        startDate: 1443650400000,
        endDate: 1446159600000,
        description: 'The concert will feature a selection of jazz and blues music. Tickets are available from the concert hall box office.'
      },
      {
        id: '175',
        title: 'Theatre Performance',
        subtitle: 'Drama and comedy',
        image: '/assets/images/theatre.jpg',
        place: 'Teatre Lliure, Barcelona',
        startDate: 1442268000000,
        endDate: 1449270000000,
        description: "The performance will feature a selection of drama and comedy plays. Tickets are available from the theatre box office."
      }
    ];

    mockEventService.getEvents.and.returnValue(of(mockEvents));

    await TestBed.configureTestingModule({
      imports: [EventListComponent, MatButtonModule, MatCardModule, RouterTestingModule],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService
        },
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and display the events', () => {
    expect(component.events.length).toBe(2);
    expect(component.events[0].title).toBe('Music Concert');
    expect(component.events[1].title).toBe('Theatre Performance');
  });

  it('should sort the events by the start date (ASC)', () => {
    component.events = component.events.sort((a, b) => a.startDate - b.startDate);
    
    expect(component.events[0].title).toBe('Theatre Performance');
    expect(component.events[1].title).toBe('Music Concert');
  });

  it('should truncate long descriptions', () => {
    const longDescription = 'A'.repeat(150);
    const truncated = component.truncateDescription(longDescription, 100);

    expect(truncated.length).toBe(103);
  });
});
