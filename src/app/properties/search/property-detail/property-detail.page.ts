import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';

import { Property } from '../../property.model';
import { PropertiesService } from '../../properties.service';
import { Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { CreateBookingComponent } from 'src/app/properties/search/bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.page.html',
  styleUrls: ['./property-detail.page.scss'],
})
export class PropertyDetailPage implements OnInit, OnDestroy {
@Input() property: Property;
@Input() form: FormGroup;
propertySub: Subscription;


  constructor(
    private router: Router,
    private navCtrl: NavController,
    private modalCtl: ModalController,
    private propertiesService: PropertiesService,
    private routes: ActivatedRoute,
    private actionsheet: ActionSheetController,
    private modalCtrl: ModalController,
    private authService: AuthService,
    private loadCtrl: LoadingController
     ) { }

  ngOnInit() {
    this.routes.paramMap.subscribe(paramMap => {
      if (!paramMap.has('propertyId')) {
        this.navCtrl.navigateBack('/properties/tabs/discover');
        return;
      }
      
      this.propertiesService.getProperty(paramMap.get('propertyId')).subscribe(prop => {
        this.property = prop});
    });     
}
submitForm() {
  this.loadCtrl.create({message: 'Saving property in the database.'}).then(loadEl => {
    loadEl.present();
    this.propertiesService.addProperty(this.property).subscribe(() => {
    this.modalCtrl.dismiss('NewProperty');
    this.modalCtrl.dismiss('SaveProperty');
    this.form.reset();
    this.router.navigateByUrl(`/properties/tabs/discover/${this.property.id}`);
  });
    });

}

cancel(){
  this.modalCtrl.dismiss(null, 'cancel', 'SaveProperty');
}
  onBookProperty() {
   this.actionsheet.create(
     {
       header: 'Choose an Action',
       buttons: [
         {
           text: 'Select Date',
           handler: () => this.openBookingModal('select')
         },
        {
          text: 'Random Date',
          handler: () => this.openBookingModal('random')
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
       ]
     }
   ).then(actionSheetEl => {
     actionSheetEl.present();
   });

  }
  openBookingModal(mode: 'select' | 'random') {
    // console.log(mode);
    // this.modalCtl.create({component: CreateBookingComponent,
    //   componentProps: {bookedProperty:this.property}})
    //   .then(modalEl => {
    //     modalEl.present();
    //     return modalEl.onDidDismiss();
    //   })
    //   .then(resultData => {
    //     console.log(resultData.data, resultData.role);
    //     if (resultData.role === 'confirm') {
    //       console.log('Booked!');
    //     }
    //   })
    //   ;
  }

  ngOnDestroy() {
    this.propertySub.unsubscribe();
  }
}
