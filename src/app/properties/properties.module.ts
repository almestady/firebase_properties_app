import { ChatDetailPage } from './chat/chat-detail/chat-detail.page';
import { ChatPageModule } from './chat/chat.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { PropertiesPage } from './properties.page';
import { PropertiesRoutingModule } from './properties-routing.module';
// import { OfferItemComponent } from './offers/offer-item/offer-item.component';
import { NewFormComponent } from './offers/new-property/new-form/new-form.component';
import { ActivatedRoute } from '@angular/router';
import { NewOfferPage } from './offers/new-offer/new-offer.page';
import { StartChatPageModule } from './chat/start-chat/start-chat.module';
import { BrowserModule } from '@angular/platform-browser';
import { ChatDetailPageModule } from './chat/chat-detail/chat-detail.module';




@NgModule({
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
   PropertiesRoutingModule,
  //  BrowserModule,
  //  ChatPageModule,
  //  StartChatPageModule,
  //  ChatDetailPageModule
  ], 
  declarations: [PropertiesPage]
})
export class PropertiesPageModule {}
