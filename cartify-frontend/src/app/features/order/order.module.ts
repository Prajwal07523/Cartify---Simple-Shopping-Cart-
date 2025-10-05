import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OrderHistoryComponent,
    PlaceOrderComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    FormsModule
  ]
})
export class OrderModule { }
