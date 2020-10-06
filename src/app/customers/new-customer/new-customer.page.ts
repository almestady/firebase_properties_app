import { Component, OnInit, ViewChild } from "@angular/core";
import { NgModel, FormGroup, FormControl, Validators } from "@angular/Forms";
import { Router, ActivatedRoute } from "@angular/router";
import { CustomerService } from "../customer.service";
import { Customer } from "../customer.model";
import { AuthService } from "src/app/auth.service";
import { LoadingController, IonSlides } from "@ionic/angular";
import { LanguagesService, Labels } from 'src/app/languages.service';


@Component({
  selector: "app-new-customer",
  templateUrl: "./new-customer.page.html",
  styleUrls: ["./new-customer.page.scss"]
})
export class NewCustomerPage implements OnInit {
  infoForm: FormGroup;
  locationForm:  FormGroup;
labels: Labels;
@ViewChild('signupSlider', {static: true}) signupSlider: IonSlides;

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private authService: AuthService,
    private loadCtrl: LoadingController,
    private languageSrvice: LanguagesService
  ) {}

  next() {  
    this.signupSlider.slideNext();  
}
prev() {
  this.signupSlider.getActiveIndex().then(index => {
    if(index === 0){
      this.router.navigateByUrl('/auth');
      return;
    }
    this.signupSlider.slidePrev();
  })
  
}

  ngOnInit() {
    this.languageSrvice.arabicLabel.subscribe(labels => {
      this.labels = labels;
    })
    this.infoForm= new FormGroup({
      userId: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      personalPic: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      title: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      firstName: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      lastName: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      confirmPassword: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      })
  });

  this.locationForm = new FormGroup( {
      gender: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      birthday: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      country: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      city: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      area: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      address: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      zipcode: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
      phone: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      })
  }) ;

  }
  createNewCustomer() {
    console.log(this.infoForm);
    //  if (!this.infoForm.valid) {
    //    return;
    //  }
    this.loadCtrl
      .create({
        message: "Creating new user..."
      })
      .then(loadEl => {
        loadEl.present();

        const customer = new Customer(
          this.infoForm.value.userId,
          this.infoForm.value.title,
          this.infoForm.value.firstName,
          this.infoForm.value.lastName,
          this.infoForm.value.birthday,
          this.infoForm.value.email,
          this.infoForm.value.password,
          this.locationForm.value.gender,
          this.locationForm.value.country,
          this.locationForm.value.city,
          this.locationForm.value.area,
          this.locationForm.value.address,
          this.locationForm.value.zipcode,
          this.locationForm.value.phone,
          "https://www.incimages.com/uploaded_files/image/1940x900/getty_856794670_385651.jpg",
          null
        );

        this.customerService.addCustomer(customer).subscribe(()=> {
          loadEl.dismiss();
          this.infoForm.reset();
          this.router.navigateByUrl(`/customers/edit/${customer.id}`);
        });
      });
  }
}
