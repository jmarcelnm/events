import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { ShoppingCartComponent } from './shared/components/shopping-cart/shopping-cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, RouterOutlet, ShoppingCartComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent { }
