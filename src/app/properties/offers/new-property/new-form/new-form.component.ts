import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Property } from '../../../property.model';
import { Labels, LanguagesService } from 'src/app/languages.service';
import { Router } from '@angular/router';
import { PropertiesService } from '../../../properties.service';
import { NavController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';
import { PropertyDetailPage } from '../../../search/property-detail/property-detail.page';
import { finalize, mergeMap, switchMap, tap } from 'rxjs/operators';


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
  loading: boolean

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

 this.loading = true;
  
  this.loadCtrl.create({ message: 'Creating user...' }).then(loadEl => {
    loadEl.present();
   
    this.propertiesService.uploadImage(this.formFourth.get('propertyPicture').value, this.property)
    .subscribe(() => {

        loadEl.dismiss();
        this.modalCtrl.dismiss('NewProperty');
        this.router.navigateByUrl(`/properties/tabs/offers`);
        
        this.form.reset();
        this.formTwo.reset();
        this.formThird.reset();
        this.formFourth.reset();
      });
    })
    
  
}

  ngOnInit() {
    
    this.languageService.arabicLabel.subscribe(labels => {
      this.labels = labels;
      // this.form.value.views = this.form;
    });
     }

     }
    