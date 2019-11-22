import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { WelcomeComponent } from './components/welcome.component';
import { ListComponent } from './components/list.component';
import { FormComponent } from './components/form.component';
import { ApiService } from './services/api.service';
import { ListenComponent } from './components/listen.component';
import { SongComponent } from './components/song.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    ListComponent,
    FormComponent,
    ListenComponent,
    SongComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
