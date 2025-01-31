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
        title: 'PABLO ALBORÁN',
        subtitle: 'Terral (2014)',
        image: '/assets/images/simple-image.jpg',
        place: 'Palau Sant Jordi, Barcelona',
        startDate: 1442959200000,
        endDate: 1447196400000,
        description: 'Pablo Alborán vuelve a los escenarios para presentar Terral (2014), un nuevo trabajo discográfico donde el artista de Málaga mantiene las constantes creativas que le han convertido en favorito del público: delicadeza, romanticismo y preciosismo melódico.'
      }
    ];

    service.getEvents()
      .subscribe((events) => {
        expect(events.length).toBe(1);
        expect(events[0].title).toBe('PABLO ALBORÁN');
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
        title: 'MANÁ',
        subtitle: 'Cama incendiada',
        image: '/assets/images/simple-image.jpg',
        place: 'Fòrum, Barcelona',
        startDate: 1439416800000,
        endDate: 1455836400000,
        description: 'Aparentar es una forma de mentir. Confiar sólo en la apariencia nos puede alejar de la esencia. Cama Incendiada, la nueva producción de Maná, no aparenta, es...'
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
