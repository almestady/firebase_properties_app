import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SearchPage } from './search.page';


import { BookingsPageModule } from 'src/app/properties/search/bookings/bookings.module';
import { CreateBookingComponent } from 'src/app/properties/search/bookings/create-booking/create-booking.component';
import { BookingsPage } from './bookings/bookings.page';
import { SharedModule } from '../../shared/shared.module';



const routes: Routes = [
  {
    path: '',
    component: SearchPage
  },
  {
    path: ''
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // BookingsPageModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [SearchPage, CreateBookingComponent],
  entryComponents: [CreateBookingComponent]
})
export class SearchPageModule {}
