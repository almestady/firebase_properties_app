// import { ProfilePageModule } from './../browser/chat/profile/profile.module';
import { StartChatPage } from './start-chat/start-chat.page';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChatPage } from './chat.page';
import { StartChatPageModule } from './start-chat/start-chat.module';

const routes: Routes = [
  {
    path: '',
    component: ChatPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    
    // StartChatPageModule,
  ],
  declarations: [ChatPage]
})
export class ChatPageModule {}
