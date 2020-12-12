import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Property } from '../../property.model';
import { Labels, LanguagesService } from 'src/app/languages.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertiesService } from '../../properties.service';
import { NavController, ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { NewFormComponent } from '../../offers/new-property/new-form/new-form.component';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  form: FormGroup;
  property: Property;
  arabicLabels: Labels;

  constructor(
    private router: Router,
    private routes: ActivatedRoute,
    private propertiesService: PropertiesService,
    private navCtrl: NavController,
    private actionsheet: ActionSheetController,
    private authService: AuthService,
    private loadCtrl: LoadingController,
    private languageService: LanguagesService,
   
    private modalCtrl: ModalController
  ) {}

 

  onSave() {
    
    this.loadCtrl.create({message: 'Saving changes...'})
    .then(loadEl => {
      loadEl.present();
      this.propertiesService.updateProperty(this.property)
      .subscribe(props => {
        this.loadCtrl.dismiss();
        this.form.reset();
        this.modalCtrl.dismiss('EditProperty');
        this.router.navigateByUrl(`/properties/tabs/discover/${this.property.id}`);
      })
    });
}
    
  
  
 
  
  ngOnInit() {
    this.languageService.arabicLabel.subscribe(labels => {
      this.arabicLabels = labels;

    });

    this.routes.paramMap.subscribe(paramMap => {
      if (!paramMap.has('propertyId')) {
        this.navCtrl.navigateBack('/properties/tabs/discover');
        return;
      }
      this.propertiesService.getProperty(paramMap.get('propertyId')).subscribe( prop => {
        this.property = {
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
};
      });

      this.form = new FormGroup({
      // id: new FormControl(this.property.id, {
      //   updateOn: 'blur',
      //   validators: [Validators.required]
      // }),
      propertyName: new FormControl(this.property.propertyName, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      propertyPicture: new FormControl(this.property.propertyPic, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(this.property.description, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      price: new FormControl(this.property.price, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      type: new FormControl(this.property.kind, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      address: new FormControl(this.property.address, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      space: new FormControl(this.property.space, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      owner: new FormControl(this.property.owner, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      // likes: new FormControl(null, {
      //   updateOn: "blur",
      //   validators: [Validators.required]
      // }),
      bedrooms: new FormControl(this.property.bedrooms, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      bathrooms: new FormControl(this.property.bathrooms, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      ketchins: new FormControl(this.property.ketchins, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      livingrooms: new FormControl(this.property.livingrooms, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      gardens: new FormControl(this.property.gardens, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      garages: new FormControl(this.property.garages, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      startDate: new FormControl(this.property.startDate, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      endDate: new FormControl(this.property.endDate, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
      // ,
      // views: new FormControl(0, {
      //   updateOn: "blur",
      //   validators: [Validators.required]
      // })
    });
  }
    );
}
}
