import { ChatDetailPage } from './../chat/chat-detail/chat-detail.page';
import { StartChatPage } from './../chat/start-chat/start-chat.page';
import { ChatPageModule } from './../chat/chat.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BrowserPage } from './browser.page';
import { StartChatPageModule } from '../chat/start-chat/start-chat.module';
import { ChatDetailPageModule } from '../chat/chat-detail/chat-detail.module';

const routes: Routes = [
  {
    path: '',
    component: BrowserPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    // ChatPageModule,
    // StartChatPageModule,
    // ChatDetailPageModule,
  ],
  declarations: [BrowserPage]
})
export class BrowserPageModule {}
