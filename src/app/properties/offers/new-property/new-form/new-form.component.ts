import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Property } from '../../../property.model';
import { Labels, LanguagesService } from 'src/app/languages.service';
import { Router } from '@angular/router';
import { PropertiesService } from '../../../properties.service';
import { NavController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { PropertyDetailPage } from '../../../search/property-detail/property-detail.page';


@Component({
  selector: 'app-new-form',
  templateUrl: './new-form.component.html',
  styleUrls: ['./new-form.component.scss'],
})
export class NewFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() formTwo: FormGroup;
  @Input() formThird: FormGroup;
  @Input() formFourth: FormGroup;
  @Input() property: Property;
  labels: Labels;
  messageActive: boolean = false;
  mapActive: boolean = false;
  map: boolean = false;
  listActive : boolean = false;
  imageActive: boolean = false;
  image: boolean = false;
  bookmark: boolean = false;
  bookmarkActive: boolean = false;
  bookmarkOn: boolean = false;
  likeOn: boolean = false;
  messages: boolean = false;

  constructor(
    private router: Router,
    private propertiesService: PropertiesService,
    private navCtrl: NavController,
   
    private actionsheet: ActionSheetController,
    private authService: AuthService,
    private loadCtrl: LoadingController,
    private languageService: LanguagesService,
    private modalCtrl: ModalController
  ) { }

onCancel() {
  this.modalCtrl.dismiss(null, 'cancel', 'NewProperty');
}

onSubmit() {
  if (this.property === null) {return}


  
  this.loadCtrl.create({ message: 'Creating user...' }).then(loadEl => {
    loadEl.present();

    this.propertiesService.addProperty(this.property)
    .subscribe((insertedId: any) => {
      loadEl.dismiss();
      this.modalCtrl.dismiss('NewProperty');
      this.router.navigateByUrl(`/properties/tabs/offers`);
      console.log(insertedId)
      this.form.reset();
      this.formTwo.reset();
      this.formThird.reset();
      this.formFourth.reset();
    });
  });
}

  ngOnInit() {
    
    this.languageService.arabicLabel.subscribe(labels => {
      this.labels = labels;
      // this.form.value.views = this.form;
    });
     }
     }
    // this.form = new FormGroup({
    //   // id: new FormControl("p1", {
    //   //   updateOn: "blur",
    //   //   validators: [Validators.required]
    //   // }),
    //   productName: new FormControl(null, {
    //     updateOn: "blur",
    //     validators: [Validators.required]
    //   }),
    //   productPicture: new FormControl(null, {
    //     updateOn: "blur",
    //     validators: [Validators.required]
    //   }),
    //   description: new FormControl(null, {
    //     updateOn: "blur",
    //     validators: [Validators.required]
    //   }),
    //   price: new FormControl(0, {
    //     updateOn: "blur",
    //     validators: [Validators.required]
    //   }),
    //   type: new FormControl(null, {
    //     updateOn: "blur",
    //     validators: [Validators.required]
    //   }),
    //   address: new FormControl(null, {
    //     updateOn: "blur",
    //     validators: [Validators.required]
    //   }),
    //   space: new FormControl(null, {
    //     updateOn: "blur",
    //     validators: [Validators.required]
    //   }),
    //   owner: new FormControl(null, {
    //     updateOn: "blur",
    //     validators: [Validators.required]
    //   }),
    //   // likes: new FormControl(null, {
    //   //   updateOn: "blur",
    //   //   validators: [Validators.required]
    //   // }),
    //   bedrooms: new FormControl(null, {
    //     updateOn: "blur",
    //     validators: [Validators.required]
    //   }),
    //   bathrooms: new FormControl(null, {
    //     updateOn: "blur",
    //     validators: [Validators.required]
    //   }),
    //   ketchins: new FormControl(null, {
    //     updateOn: "blur",
    //     validators: [Validators.required]
    //   }),
    //   livingrooms: new FormControl(null, {
    //     updateOn: "blur",
    //     validators: [Validators.required]
    //   }),
    //   gardens: new FormControl(null, {
    //     updateOn: "blur",
    //     validators: [Validators.required]
    //   }),
    //   garages: new FormControl(null, {
    //     updateOn: "blur",
    //     validators: [Validators.required]
    //   }),
    //   startDate: new FormControl(null, {
    //     updateOn: "blur",
    //     validators: [Validators.required]
    //   }),
    //   endDate: new FormControl(null, {
    //     updateOn: "blur",
    //     validators: [Validators.required]
    //   })
      // ,
      // views: new FormControl(0, {
      //   updateOn: "blur",
      //   validators: [Validators.required]
      // })
    // });

    // if (!this.property) {
    //   if (!this.property.id) {
    //     this.property.id = "رقم المنتج";
    //   }
    //   if (!this.property.imageUrl) {
    //     this.property.imageUrl =
    //       "https://cdn2.iconfinder.com/data/icons/rcons-user/32/male-circle-512.png";
    //   }
    //   if (!this.property.ketchins) {
    //     this.property.ketchins = 0;
    //   }
    //   if (!this.property) {
    //   }
    //   if (!this.property.likes) {
    //     this.property.likes = null;
    //   }
    //   if (!this.property.livingrooms) {
    //     this.property.livingrooms = 0;
    //   }
    //   if (!this.property.owner) {
    //     this.property.owner = "المالك";
    //   }
    //   if (!this.property.price) {
    //     this.property.price = 0;
    //   }
    //   if (!this.property.space) {
    //     this.property.space = "";
    //   }
    //   if (!this.property.startDate) {
    //     this.property.startDate = null;
    //   }
    //   if (!this.property.title) {
    //     this.property.title = "";
    //   }
    //   if (!this.property.type) {
    //     this.property.type = "نوع العرض";
    //   }
    //   if (!this.property.userId) {
    //     this.property.userId = "رقم المستخدم";
    //   }
    //   if (!this.property.address) {
    //     this.property.address = "العنوان";
    //   }
    //   if (!this.property.bathrooms) {
    //     this.property.bathrooms = 0;
    //   }
    //   if (!this.property.bedrooms) {
    //     this.property.bedrooms = 0;
    //   }
    //   if (!this.property.description) {
    //     this.property.description = "الوصف";
    //   }
    //   if (!this.property.views) {
    //     this.property.views = null;
    //   }
    // }
  // }
// }
  // onSubmit() {
  //   this.loadCtrl.create({ message: 'Creating user...' }).then(loadEl => {
  //     loadEl.present();
  //     const newProperty = new Property(
  //       'p13',
  //       this.authService.userId,
  //       this.form.value.present,
  //       this.form.value.description,
  //       this.form.value.imageUrl,
  //       this.form.value.price,
  //       this.form.value.type,
  //       this.form.value.address,
  //       this.form.value.space,
  //       this.form.value.owner,
  //       this.form.value.likes,
  //       this.form.value.bedrooms,
  //       this.form.value.bathrooms,
  //       this.form.value.kitchen,
  //       this.form.value.livingrooms,
  //       this.form.value.gardens,
  //       this.form.value.garages,
  //       this.form.value.startDate,
  //       this.form.value.endDate,
  //       this.form.value.views
  //     );

  //      this.router.navigateByUrl(`/properties/tabs/discover/${newProperty.id}`);
  //     this.modalCtrl.create({})
  //     this.propertiesService.addProperty(newProperty).subscribe(() => {
  //       loadEl.dismiss();
  //       this.form.reset();
  //     });
  //   });
  // }

