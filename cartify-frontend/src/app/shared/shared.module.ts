import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import shared components here when created
// import { HeaderComponent } from './components/header/header.component';
// import { FooterComponent } from './components/footer/footer.component';
// import { LoaderComponent } from './components/loader/loader.component';

// Import pipes
// import { CurrencyFormatPipe } from './pipes/currency-format.pipe';

@NgModule({
  declarations: [
    // Components
    // HeaderComponent,
    // FooterComponent,
    // LoaderComponent,
    
    // Pipes
    // CurrencyFormatPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    // Modules
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    
    // Components
    // HeaderComponent,
    // FooterComponent,
    // LoaderComponent,
    
    // Pipes
    // CurrencyFormatPipe,
  ]
})
export class SharedModule { }