import { ImagePickerComponent } from './../../../../../firebase_frontend-master/src/app/shared/pickers/image-picker/image-picker.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StartChatPage } from './start-chat.page';

const routes: Routes = [
  {
    path: '',
    component: StartChatPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StartChatPage, ImagePickerComponent]
})
export class StartChatPageModule {}
