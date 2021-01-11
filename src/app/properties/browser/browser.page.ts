import { SearchPage } from './../search/search.page';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { Labels, LanguagesService } from 'src/app/languages.service';
import { Property } from '../property.model';
import { PropertiesService } from '../properties.service';
import { IonRouterOutlet, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.page.html',
  styleUrls: ['./browser.page.scss'],
})
export class BrowserPage implements OnInit {
  labels: Labels;
  isLoading: boolean;
  labelsSub: Subscription;
  propertiesSub:Subscription;
  listedloadedProperties: Property[] = [];
  relevantProperties: Property[] = [];
  currentProperty: Property;
  loadedProperties: Property[] = []
  showBig: boolean;
  smaleBox: boolean;
  bigBox: boolean;
  @Output() pinChange = new EventEmitter();
  modal: ModalController
 

  constructor(
    private languageService: LanguagesService,
    private propertiesService: PropertiesService,
    private router: Router,
    private modalCtrl: ModalController,
    private elementRef: ElementRef,
    private routerOutlet: IonRouterOutlet

  ) { }

 
  
  ngOnInit() {
    
    this.showBig = false
    this.bigBox = false;
    this.smaleBox = true;
    console.log('Search Page init')
    this.labelsSub = this.languageService.arabicLabel.subscribe(
      (labels) => {this.labels = labels}
    );

      this.propertiesSub = this.propertiesService.properties.subscribe(
        (properties) => {
       
          
          console.log(properties);
          this.loadedProperties = properties;
          this.relevantProperties = this.loadedProperties;
          this.currentProperty = this.loadedProperties[0];
          this.listedloadedProperties = this.relevantProperties.slice(1);
          // this.listedloadedProperties = props;
          //   this.relevantProperties = this.listedloadedProperties;
          //   this.currentProperty = this.relevantProperties[0];
            
        }
        );
  }

  ionViewWillEnter() {
    // this.isLoading = true;
    this.propertiesService.getProperties()
    //   this.isLoading = false;
      
    // }); 
  }

  setCurrentProperty(property: Property) {
    if(this.currentProperty){

      this.currentProperty = property;
      this.showBig = true;
     
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
      this.router.navigateByUrl(`properties/tabs/browser/${property.id}`)
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

  
onPinClick(event: Event){
  let element = event.target as HTMLInputElement;
  element.style
  
}
  
}
