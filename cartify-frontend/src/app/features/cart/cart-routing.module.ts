import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartViewComponent } from './components/cart-view/cart-view.component';
import { PlaceOrderComponent } from '../order/components/place-order/place-order.component';

const routes: Routes = [
  { path: '', component: CartViewComponent },
  { path: 'place-order', component: PlaceOrderComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
