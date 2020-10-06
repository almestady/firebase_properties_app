import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OffersPage } from './offers.page';
import { OfferItemComponent } from './offer-item/offer-item.component';
import { NewOfferPage } from './new-offer/new-offer.page';
import { NewOfferPageModule } from './new-offer/new-offer.module';
import { EditPage } from './edit/edit.page';



const routes: Routes = [
  {
    path: '',
    component: OffersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    // NewOfferPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OffersPage, OfferItemComponent, EditPage],
  entryComponents: [EditPage ]
})
export class OffersPageModule {}
