import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { PlaceOrderComponent } from './components/place-order/place-order.component';
import { authGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: PlaceOrderComponent, canActivate: [authGuard] }, // /place-order
  { path: 'my-orders', component: OrderHistoryComponent, canActivate: [authGuard] } // /place-order/history
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
