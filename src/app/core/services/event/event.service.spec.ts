import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Event, EventInfo, EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventService,
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });

    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the events', (done) => {
    const mockEvents: Event[] = [
      {
        id: '184',
        title: 'Art Gallery',
        subtitle: 'Exhibition of paintings',
        image: '/assets/images/art.jpg',
        place: 'Art Gallery, Barcelona',
        startDate: 1442959200000,
        endDate: 1447196400000,
        description: 'The exhibition will feature a selection of paintings by local artists. The gallery is open from 10am to 6pm, Monday to Friday.'
      }
    ];

    service.getEvents()
      .subscribe((events) => {
        expect(events.length).toBe(1);
        expect(events[0].title).toBe('Art Gallery');
        done();
      });

    const req = httpMock.expectOne('assets/mock-data/events.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockEvents);
  });

  it('should fetch an event info by ID', (done) => {
    const mockEventInfo: EventInfo = {
      event: {
        id: '219',
        title: 'Dance Performance',
        subtitle: 'Ballet and contemporary dance',
        image: '/assets/images/dance.jpg',
        place: 'Teatre Nacional de Catalunya, Barcelona',
        startDate: 1439416800000,
        endDate: 1455836400000,
        description: 'The performance will feature a selection of ballet and contemporary dance pieces. Tickets are available from the theatre box office.'
      },
      sessions: [
        {
          date: 1439416800000,
          availability: 50
        }
      ]
    };

    service.getEventInfo('219')
      .subscribe((eventInfo) => {
        expect(eventInfo!.event.id).toBe('219');
        expect(eventInfo!.sessions.length).toBe(1);
        expect(eventInfo!.sessions[0].availability).toBe(50);
        done();
      });

    const req = httpMock.expectOne('assets/mock-data/event-info.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockEventInfo);
  });
});
