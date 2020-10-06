import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewPropertyPage } from './new-property.page';
import { NewFormComponent } from './new-form/new-form.component';
import { PropertyDetailPage } from '../../search/property-detail/property-detail.page';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: NewPropertyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [NewPropertyPage, NewFormComponent],
  entryComponents: [NewFormComponent]
})
export class NewPropertyPageModule {}
