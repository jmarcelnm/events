import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ShoppingCartComponent } from './shopping-cart.component';
import { ShoppingCartService } from '../../../core/services/shopping-cart/shopping-cart.service';
import { EventService } from '../../../core/services/event/event.service';
import { BehaviorSubject, of } from 'rxjs';

describe('ShoppingCartComponent', () => {
  let component: ShoppingCartComponent;
  let fixture: ComponentFixture<ShoppingCartComponent>;
  let mockShoppingCartService: jasmine.SpyObj<ShoppingCartService>;
  let mockEventService: jasmine.SpyObj<EventService>;
  let cartSubject: BehaviorSubject<{ [eventId: number]: { sessionId: number; quantity: number }[] }>;

  beforeEach(async () => {
    cartSubject = new BehaviorSubject<{ [eventId: number]: { sessionId: number; quantity: number }[] }>({
      1: [{
        sessionId: 1443650400000,
        quantity: 2
      }]
    });

    mockShoppingCartService = jasmine.createSpyObj('ShoppingCartService', ['removeFromCart']);
    mockShoppingCartService.cart$ = cartSubject.asObservable();

    mockEventService = jasmine.createSpyObj('EventService', ['getEvents', 'getEventInfo']);
    mockEventService.getEvents.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ShoppingCartComponent],
      providers: [
        {
          provide: ShoppingCartService,
          useValue: mockShoppingCartService
        },
        {
          provide: EventService,
          useValue: mockEventService
        },
        provideHttpClient()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch the cart data on init', () => {
    expect(component.cart).toBeDefined();
    expect(component.cart['1']).toBeDefined();
    expect(component.cart['1'][0].quantity).toBe(2);
  });

  it('should remove items from the cart', () => {
    component.removeFromCart(1, 1443650400000);
    expect(mockShoppingCartService.removeFromCart).toHaveBeenCalledWith(1, 1443650400000);
  });

  it('should update the cart when new items are added to it', () => {
    cartSubject.next({
      '1': [
        {
          sessionId: 1443650400000,
          quantity: 3
        }
      ]
    });

    fixture.detectChanges();
    expect(component.cart['1'][0].quantity).toBe(3);
  });
});
