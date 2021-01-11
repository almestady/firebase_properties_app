import { AuthService } from 'src/app/auth.service';

import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { Labels, LanguagesService } from 'firebase_frontend-master/firebase_frontend-master/src/app/languages.service';

import { Property } from 'firebase_frontend-master/firebase_frontend-master/src/app/properties/property.model';
import { Subscription } from 'rxjs';
import { PropertiesService } from '../properties.service';

@Component({
  selector: 'app-myproperties',
  templateUrl: './myproperties.page.html',
  styleUrls: ['./myproperties.page.scss'],
})
export class MypropertiesPage implements OnInit {
labels: Labels;
  isLoading: boolean;
  labelsSub: Subscription;
  propertiesSub:Subscription;
  listedloadedProperties: Property[] = [];
  relevantProperties: Property[] = [];
  currentProperty: Property;
  loadedProperties: Property[] = []

  editable: boolean;

  constructor(
    private authService: AuthService,
    private languageService: LanguagesService,
    private propertiesService: PropertiesService,
    private router: Router,
    private modalCtrl: ModalController,
    private elementRef: ElementRef,
    private routerOutlet: IonRouterOutlet
  ) { }

  ngOnInit() {
    this.editable = false;
    this.isLoading = true;
    console.log('Search Page init')
    this.labelsSub = this.languageService.arabicLabel.subscribe(
      (labels) => {this.labels = labels}
      );
      
      this.propertiesSub = this.propertiesService.properties.subscribe(
        (properties) => {
          this.relevantProperties = [];
          
          console.log(properties);
          // this.loadedProperties = properties;
          // this.relevantProperties = this.loadedProperties.slice(1);
          properties.forEach(property => {
            if(property.userId === this.authService.currentUserId){
              this.relevantProperties.push(property)
              console.log( 'A property', property.userId)
            }
          })
          this.isLoading = false;
          
          // this.relevantProperties.filter(property => { property.userId === this.authService.currentUserId});
          this.currentProperty = this.loadedProperties[0];
          // this.listedloadedProperties = this.loadedProperties.slice(1);
          // this.listedloadedProperties = this.relevantProperties.slice(1);
          // this.listedloadedProperties = props;
          //   this.relevantProperties = this.listedloadedProperties;
          //   this.currentProperty = this.relevantProperties[0];
         
        }
        );
  }

  ionViewWillEnter() {
    this.editable = false;
    this.propertiesService.getProperties()
  }

onEdit(propertyId: string){
  this.editable = true;
}

  setCurrentProperty(property: Property) {
    if(this.currentProperty){

      this.currentProperty = property;
     
     
    }
  }


  ngOnDestroy() {
    if (this.labelsSub) {
      this.labelsSub.unsubscribe();
    }
    if (this.propertiesSub) {
      this.propertiesSub.unsubscribe();
    }
    
  }

    openProperty(property: Property){
      this.router.navigateByUrl(`properties/tabs/offers/${property.id}`)
        // this.modalCtrl
        // .create({
        //   component: SearchPage,
        //   componentProps: { theProperty: property, id: 'theProperty'},
        //   cssClass: 'my-custom-class',
        //   // animated: true,
        //   // showBackdrop: true
        // })
        // .then((modalEl) => {
        //    modalEl.present();
        //   return modalEl.onDidDismiss();
        // })
        
  }


}
