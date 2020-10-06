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
      property => this.property =  property
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
