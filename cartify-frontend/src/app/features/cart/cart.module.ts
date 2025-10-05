// ==================== features/cart/cart.module.ts ====================

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartRoutingModule } from './cart-routing.module';
import { CartViewComponent } from './components/cart-view/cart-view.component';

@NgModule({
  declarations: [
    CartViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CartRoutingModule
  ]
})
export class CartModule { }