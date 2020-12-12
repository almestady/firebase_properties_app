import { Component, OnInit, Input } from "@angular/core";
import { Property } from "../../property.model";
import { PropertiesService } from "../../properties.service";
import { LanguagesService, Labels } from "src/app/languages.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { ModalController, LoadingController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-new-offer",
  templateUrl: "./new-offer.page.html",
  styleUrls: ["./new-offer.page.scss"]
})
export class NewOfferPage implements OnInit {
  @Input() propertyId: string;
  property: Property ;
  labels: Labels;
  form: FormGroup;

  constructor(
    private propertiesService: PropertiesService,
    private languageService: LanguagesService,
    private modalCtrl: ModalController,
    private loadCtrl: LoadingController,
    private router: Router
  ) {}

  onCancel() {
    this.modalCtrl.dismiss(null, "cancel", "newOffer");
  }

  ngOnInit() {
    this.propertiesService.getProperty(this.propertyId).subscribe(
      prop => this.property =  {
        id: prop.payload.id,
        address:  prop.payload.data()['address'],
       bathrooms:  prop.payload.data()['bathrooms'],
       bedrooms:  prop.payload.data()['bedrooms'],
       description: prop.payload.data()['description'],
       display:  prop.payload.data()['display'],
       endDate:  prop.payload.data()['endDate'],
       garages:  prop.payload.data()['garages'],
       gardens:  prop.payload.data()['gardens'],
       hasOffer:  prop.payload.data()['hasOffer'],
       ketchins:  prop.payload.data()['ketchins'],
       kind:  prop.payload.data()['kind'],
       likes:  prop.payload.data()['likes'],
       livingrooms:  prop.payload.data()['livingrooms'],
       owner:  prop.payload.data()['owner'],
       price:  prop.payload.data()['price'],
       propertyName:  prop.payload.data()['propertyName'],
       propertyPic:  prop.payload.data()['propertyPic'],
       reservations: prop.payload.data()['reservations'],
       space:  prop.payload.data()['space'],
       startDate:  prop.payload.data()['startDate'],
       tags:  prop.payload.data()['tags'],
       userId:  prop.payload.data()['userId'],
       views:  prop.payload.data()['views'],
       location:  prop.payload.data()['location'],
       updated_at: prop.payload.data()['updated_at'],
       created_at: prop.payload.data()['created_at']           
}
    );
    // this.propertiesService.properties.subscribe(properties => {
    //   this.property = properties.find(
    //     property => property.id === this.propertyId
    //   );
    // });
    this.languageService.arabicLabel.subscribe(labels => {
      this.labels = labels;
    });

    this.form = new FormGroup({
      offerPrice: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      startDate: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      endDate: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      })
    });
  }

  onSubmit() {
    

    this.loadCtrl.create({ message: "Creating offer..." }).then(loadEl => {
      loadEl.present();
      this.propertiesService.updateProperty(this.property).subscribe(() => {
        this.loadCtrl.dismiss();
        this.form.reset();
        this.modalCtrl.dismiss("newOffer");
        this.router.navigateByUrl(`/properties/tabs/offers`);
      });
    });
  }
}
