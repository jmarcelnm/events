import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EventDetailsComponent } from './event-details.component';
import { EventService } from '../../core/services/event/event.service';
import { ShoppingCartService } from '../../core/services/shopping-cart/shopping-cart.service';
import { of } from 'rxjs';

describe('EventDetailsComponent', () => {
  let component: EventDetailsComponent;
  let fixture: ComponentFixture<EventDetailsComponent>;
  let mockEventService: jasmine.SpyObj<EventService>;
  let mockShoppingCartService: jasmine.SpyObj<ShoppingCartService>;

  beforeEach(async () => {
    mockEventService = jasmine.createSpyObj('EventService', ['getEventInfo']);
    mockShoppingCartService = jasmine.createSpyObj(
      'ShoppingCartService',
      [
        'addToCart',
        'removeFromCart'
      ],
      {
        cart$: of({})
      }
    );

    const mockEventInfo = {
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

    mockEventService.getEventInfo.and.returnValue(of(mockEventInfo));

    await TestBed.configureTestingModule({
      imports: [EventDetailsComponent],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService
        },
        {
          provide: ShoppingCartService,
          useValue: mockShoppingCartService
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        },
        {
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { eventId: '1' }
        },
        MatDialogModule,
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the event details on init', () => {
    expect(component.eventInfo).toBeDefined();
    expect(component.eventInfo?.event.id).toBe('219');
  });

  it('should add a seat to the cart', () => {
    component.addToCart(1439416800000);
    expect(mockShoppingCartService.addToCart).toHaveBeenCalledWith(219, 1439416800000);
  });

  it('should remove a seat from the cart', () => {
    component.selectedSeats = { 1439416800000: 2 };
    component.removeFromCart(1439416800000);
    expect(mockShoppingCartService.removeFromCart).toHaveBeenCalledWith(219, 1439416800000);
  });

  it('should calculate the available seats correctly', () => {
    component.selectedSeats = { 1439416800000: 5 };
    expect(component.getAvailableSeats(1439416800000)).toBe(45);
  });
});
