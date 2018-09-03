import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { CajeroService } from './services/cajero.service';

import { AppComponent } from './app.component';
import { MonederoComponent } from './components/monedero/monedero.component';

@NgModule({
  declarations: [
    AppComponent,
    MonederoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
    CajeroService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
