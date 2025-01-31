import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        MatButtonModule,
        MatIconModule,
        MatToolbarModule
      ],
      providers: [
        provideHttpClient(),
        provideRouter(routes)
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should toggle the dark mode', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    spyOn(localStorage, 'setItem');

    app.toggleDarkMode();
    expect(app.isDarkMode).toBeTrue();
    expect(document.body.classList.contains('dark-mode')).toBeTrue();

    app.toggleDarkMode();
    expect(app.isDarkMode).toBeFalse();
    expect(document.body.classList.contains('dark-mode')).toBeFalse();
  });

  it('should render the shopping cart component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-shopping-cart')).toBeTruthy();
  });
});
