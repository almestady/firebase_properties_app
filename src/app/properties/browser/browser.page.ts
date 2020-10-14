import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Labels, LanguagesService } from 'src/app/languages.service';
import { Property } from '../property.model';
import { PropertiesService } from '../properties.service';

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
  listedloadedProperties: Property[];
  relevantProperties: Property[];
  currentProperty: Property;
  loadedProperties: Property[]
  showBig: boolean;


  constructor(
    private languageService: LanguagesService,
    private propertiesService: PropertiesService,
    private router: Router
  ) { }


  
  ngOnInit() {
    this.showBig = false

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
    this.isLoading = true;
    this.propertiesService.getProperties().subscribe(()=>{
      this.isLoading = false;
      
    }); 
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
}
