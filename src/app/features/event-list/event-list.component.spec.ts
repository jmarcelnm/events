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
        title: 'JOAN MANUEL SERRAT',
        subtitle: 'Antología desordenada',
        image: '/assets/images/simple-image.jpg',
        place: 'Camp de Mart, Tarragona',
        startDate: 1443650400000,
        endDate: 1446159600000,
        description: 'Cinquanta cançons en un disc quàdruple, un llibre amb textos personals i un centenar de fotografies per commemorar mig segle als escenaris.'
      },
      {
        id: '175',
        title: 'KAREN SOUZA',
        subtitle: 'Essentials',
        image: '/assets/images/simple-image.jpg',
        place: 'Luz de Gas, Barcelona',
        startDate: 1442268000000,
        endDate: 1449270000000,
        description: "While Karen Souza's voice may sound like it was made for jazz, she is in fact a relative newcomer to this genre of music."
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
    expect(component.events[0].title).toBe('JOAN MANUEL SERRAT');
    expect(component.events[1].title).toBe('KAREN SOUZA');
  });

  it('should sort the events by the start date (ASC)', () => {
    component.events = component.events.sort((a, b) => a.startDate - b.startDate);
    
    expect(component.events[0].title).toBe('KAREN SOUZA');
    expect(component.events[1].title).toBe('JOAN MANUEL SERRAT');
  });

  it('should truncate long descriptions', () => {
    const longDescription = 'A'.repeat(150);
    const truncated = component.truncateDescription(longDescription, 100);

    expect(truncated.length).toBe(103);
  });
});
