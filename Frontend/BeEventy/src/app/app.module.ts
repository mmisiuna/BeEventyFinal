import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { EventListComponent } from './event-list/event-list.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { BanerComponent } from './baner/baner.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routes';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { EventComponent } from './event/event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EventDetailsComponent } from './event-details/event-details.component';
import { FooterComponent } from './footer/footer.component';
import { AccountComponent } from './account/account.component';
import { AddEventComponent } from './add-event/add-event.component';
import { TicketComponent } from './ticket/ticket.component';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage/manage.component';

@NgModule({
  declarations: [
    AppComponent,
    EventListComponent,
    LoginComponent,
    RegistrationComponent,
    BanerComponent,
    NavigationBarComponent,
    EventComponent,
    EventDetailsComponent,
    FooterComponent,
    AddEventComponent,
    AccountComponent,
    TicketComponent,
    ManageComponent  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
