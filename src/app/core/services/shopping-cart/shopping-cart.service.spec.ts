import { TestBed } from '@angular/core/testing';
import { ShoppingCartService } from './shopping-cart.service';

describe('ShoppingCartService', () => {
  let service: ShoppingCartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [ShoppingCartService],
    });

    service = TestBed.inject(ShoppingCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with an empty cart', (done) => {
    service.cart$
      .subscribe((cart) => {
        expect(cart).toEqual({});
        done();
      });
  });

  it('should add an item to the cart', (done) => {
    service.addToCart(1, 1443650400000);

    service.cart$
      .subscribe((cart) => {
        expect(cart['1']).toBeDefined();
        expect(cart['1'].length).toBe(1);
        expect(cart['1'][0].sessionId).toBe(1443650400000);
        expect(cart['1'][0].quantity).toBe(1);
        done();
      });
  });

  it('should increase the quantity when adding the same session', (done) => {
    service.addToCart(1, 1443650400000);
    service.addToCart(1, 1443650400000);

    service.cart$
      .subscribe((cart) => {
        expect(cart['1'][0].quantity).toBe(2);
        done();
      });
  });

  it('should remove an item from the cart', (done) => {
    service.addToCart(1, 1443650400000);
    service.addToCart(1, 1443650400000);
    service.removeFromCart(1, 1443650400000);

    service.cart$
      .subscribe((cart) => {
        expect(cart['1'][0].quantity).toBe(1);
        done();
      });
  });

  it('should remove the session when the quantity reaches zero', (done) => {
    service.addToCart(1, 1443650400000);
    service.removeFromCart(1, 1443650400000);

    service.cart$
      .subscribe((cart) => {
        expect(cart['1']).toBeUndefined();
        done();
      });
  });
});
