import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PropertiesService } from '../../properties.service';
import { Property } from '../../property.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers-bookings',
  templateUrl: './offers-bookings.page.html',
  styleUrls: ['./offers-bookings.page.scss'],
})
export class OffersBookingsPage implements OnInit, OnDestroy {
property: Property;
propSub: Subscription;

  constructor(
    private routes: ActivatedRoute,
     private navCtl:NavController,
     private propertiesServices: PropertiesService) { }

  ngOnInit() {
    this.routes.paramMap.subscribe(paramMap => {
      if(!paramMap.has('propertyId')) {
        this.navCtl.navigateBack('/properties/tabs/offers');
        return;
      }
    this.propSub =  this.propertiesServices.getProperty(paramMap.get('offerId')).subscribe(prop => {
       this.property = prop;
     });
    });
  }

  ngOnDestroy() {
    if(this.propSub){

      this.propSub.unsubscribe();
    }
  }

}
