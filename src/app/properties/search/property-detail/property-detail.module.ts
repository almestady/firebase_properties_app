import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PropertyDetailPage } from './property-detail.page';

// import { NewFormComponent } from '../../offers/new-property/new-form/new-form.component';
import { CreateBookingComponent } from 'src/app/properties/search/bookings/create-booking/create-booking.component';

const routes: Routes = [
  {
    path: '',
    component: PropertyDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PropertyDetailPage],
  entryComponents: []
})
export class PropertyDetailPageModule {}
