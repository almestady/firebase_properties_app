import { AuthService } from 'src/app/auth.service';
import { OffersService } from '../offers.service';
import { ModalController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Offer } from 'firebase_frontend-master/firebase_frontend-master/src/app/properties/offers/offer.model';
import { Property } from 'firebase_frontend-master/firebase_frontend-master/src/app/properties/property.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss'],
})
export class OffersComponent implements OnInit {
  offers: Offer[];
  theProperty: Property;
  form: FormGroup;
  offerPrice: number;

  constructor(
    private modalCtrl: ModalController, 
    private offersService: OffersService,
    private authService: AuthService,
    private altCtrl: AlertController
    ) { }

  ngOnInit() {
    this.form = new FormGroup({
      offerPrice: new FormControl(0, {
        updateOn: "blur",
        validators: [Validators.required]
      })
    })
    // this.offersService.offers.subscribe(offers => {
    //   this.offers = offers;
    // })
  }

  onDone(price:number){
    this.offerPrice = price
    
  }

  onOk(){
   
    let offer = {
      createdAt: new Date(),
      propertyId: this.theProperty.id,
      userId: this.authService.currentUserId,
      offerPrice:this.offerPrice
    }
     
    this.offersService.addOffer(offer).subscribe(offer =>{
      this.modalCtrl.dismiss('offer')
    })
  }

  onCancel(){
    this.modalCtrl.dismiss('offer')
  }

}
