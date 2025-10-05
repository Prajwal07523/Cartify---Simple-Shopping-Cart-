import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

// Services
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { ProductService } from './services/product.service';
//import { UserService } from './services/user.service';

// Guards
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { HttpClientModule } from '@angular/common/http';

// // Interceptors
// import { AuthInterceptor } from './interceptors/auth.interceptor';
// import { ErrorInterceptor } from './interceptors/error.interceptor';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
     HttpClientModule
  ],
  providers: [
    // Services
    AuthService,
    CartService,
    ProductService,
    //UserService,
    // Guards
    //authGuard,
    //guestGuard,
    // Interceptors are provided in app.module.ts
  ]
})
export class CoreModule {
  // Prevent re-import of CoreModule
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it only in AppModule');
    }
  }
}