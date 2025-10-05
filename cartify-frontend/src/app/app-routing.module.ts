import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

const routes: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full'
  },

  // Auth routes (lazy loaded) - Only accessible when NOT logged in
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
    canMatch: [guestGuard]
  },

  // Products routes (lazy loaded) - Public access
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.module').then(m => m.ProductsModule)
  },

  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule),
    canActivate: [authGuard],
    canMatch: [authGuard]
  },

  // Place Order route (top-level)
  {
  path: 'place-order',
  loadChildren: () => import('./features/order/order.module').then(m => m.OrderModule),
  canActivate: [authGuard],
  canMatch: [authGuard]
},


  

  // Wildcard route - 404 page
  {
    path: '**',
    redirectTo: '/products'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // Optional: Enable preloading strategy for better performance
    // preloadingStrategy: PreloadAllModules,
    
    // Enable scroll position restoration
    scrollPositionRestoration: 'enabled',
    
    // Anchor scrolling
    anchorScrolling: 'enabled',
  
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }