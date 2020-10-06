import { Component, OnInit, ViewChild } from "@angular/core";
import { Routes, Router, ActivatedRoute } from "@angular/router";


import {
  NavController,
  ModalController,
  ActionSheetController,
  LoadingController,
  IonSlides
} from "@ionic/angular";
import { PropertiesService } from "../../properties.service";
import { Property, HasOffer, Reservation } from '../../property.model';
import { AuthService } from "src/app/auth.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { LanguagesService, Labels } from "src/app/languages.service";
import { NewFormComponent } from './new-form/new-form.component';
// import { unlink } from 'fs';
import { Location } from '../../location.model';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}


@Component({
  selector: "app-new-property",
  templateUrl: "./new-property.page.html",
  styleUrls: ["./new-property.page.scss"],
 
})
export class NewPropertyPage implements OnInit {
  form: FormGroup;
  formTwo: FormGroup;
  formThird: FormGroup;
  formFourth: FormGroup;
  property: Property;
  labels: Labels;
  public submitAttempt: boolean = false;
 @ViewChild('newProperty') newProperty: IonSlides;

  constructor(
    private router: Router,
    private propertiesService: PropertiesService,
    private navCtrl: NavController,
    private actionsheet: ActionSheetController,
    private authService: AuthService,
    private loadCtrl: LoadingController,
    private languageService: LanguagesService,
   
    private modalCtrl: ModalController
  ) {}

next() {  
    this.newProperty.slideNext();  
}
prev() {
  this.newProperty.getActiveIndex().then(index => {
    if(index === 0) {
      this.navCtrl.navigateBack("/properties/tabs/offers");
      //  this.navCtrl.navigateBack("/properties/tabs/offers");
      return;
    }
    this.newProperty.slidePrev();
  })
  
}

save() {
  this.submitAttempt = true;

  if(!this.form.valid){
      this.newProperty.slideTo(0);
  } 
  else if(!this.formTwo.valid){
      this.newProperty.slideTo(1);
  }else if(!this.formThird.valid){
    this.newProperty.slideTo(2);
}else if(!this.formFourth.valid || !this.formFourth.get('propertyPicture').value) {
  this.newProperty.slideTo(3);
}
  else {
      console.log("success!")
      console.log(this.form.value);
      console.log(this.formTwo.value);
      console.log(this.formThird.value);
      console.log(this.formFourth.value);
  }
}



 formInfo() {
  this.property = { 
    id:'',
    userId:this.authService.userId,
    propertyName: this.form.value.propertyName,
    description: this.form.value.description,
    propertyPic: this.form.value.propertyPicture,
    price: this.form.value.price,
    kind: this.form.value.kind,
    address: this.formTwo.value.address,
    space: this.formTwo.value.space,
    owner: this.formTwo.value.owner,
    likes: this.form.value.likes,
    bedrooms: this.formThird.value.bedrooms,
    bathrooms: this.formThird.value.bathrooms,
    ketchins: this.formThird.value.kitchen,
    livingrooms: this.formThird.value.livingrooms,
    gardens: this.formThird.value.gardens,
    garages: this.formThird.value.garages,
    startDate: this.formTwo.value.startDate,
    endDate: this.formTwo.value.endDate,
    views: this.form.value.views,
    tags: this.form.value.tags,
    hasOffer: this.form.value.HasOffer,
    reservations: this.form.value.Reservation,
    display: this.form.value.display,
    location: this.formFourth.value.location,
    created_at: new Date(),
    updated_at: new Date()
  };
 }

  onSave() {
    this.save()
    this.formInfo();
    console.log(this.property.location)
    this.modalCtrl.create(
       {
         component: NewFormComponent,
         componentProps:
          { property: this.property, form: this.form, formTwo: this.formTwo, formThird: this.formThird, formFourth: this.formFourth},
          id: 'NewProperty'
        })
       .then(modlEl => {
         modlEl.present();
         
       });
}
  exitBack(){
    this.navCtrl.navigateBack("/properties/tabs/offers");
  }
  ngOnInit() {
    this.languageService.arabicLabel.subscribe(labels => {
      this.labels = labels;

    });

    this.form = new FormGroup({
      // id: new FormControl("p1", {
      //   updateOn: "blur",
      //   validators: [Validators.required]
      // }),
      propertyName: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      // propertyPicture: new FormControl(null, {
      //   updateOn: "blur",
      //   validators: [Validators.required]
      // }),
      description: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      price: new FormControl(0, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      kind: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      })
      // ,
      // views: new FormControl(0, {
      //   updateOn: "blur",
      //   validators: [Validators.required]
      // })
    });

this.formTwo = new FormGroup({  
      address: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      space: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      owner: new FormControl(null, {
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
      // likes: new FormControl(null, {
      //   updateOn: "blur",
      //   validators: [Validators.required]
      // }),
      
});

    this.formThird = new FormGroup({
      bedrooms: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      bathrooms: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      ketchins: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      livingrooms: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      gardens: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      garages: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      })
    });

    this.formFourth = new FormGroup({
      location: new FormControl(null, {validators:[Validators.required]}),
      propertyPicture: new FormControl(null)
    });

  }
  onLocationPicked(location: Location) {
  this.formFourth.patchValue({location:location})
  }


  onImagePicked(image: string | File ) {
    let imageFile;
    if(typeof image === 'string') {
      try{
        imageFile =  base64toBlob(image.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
      } catch(error){
        console.log(error);
        return;
      }
       
    } else {
      imageFile = image;
    }
    this.formFourth.patchValue({propertyPicture:imageFile})
    }

}
  
