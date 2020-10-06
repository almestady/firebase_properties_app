import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  EmailValidator
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { NavController, LoadingController } from "@ionic/angular";
import { CustomersPage } from "../customers.page";
import { Customer } from "../customer.model";
import { CustomerService } from "../customer.service";
import { Property } from "src/app/properties/property.model";
import { LanguagesService, Labels } from "src/app/languages.service";

@Component({
  selector: "app-edit-customer",
  templateUrl: "./edit-customer.page.html",
  styleUrls: ["./edit-customer.page.scss"]
})
export class EditCustomerPage implements OnInit {
  form: FormGroup;
  customer: Customer;
  arabicLabels: Labels;

  constructor(
    private routes: ActivatedRoute,
    private navCtrl: NavController,
    private customerService: CustomerService,
    private languageService: LanguagesService,
    private router: Router,
    private loadCtrl: LoadingController
  ) {}

  ngOnInit() {
   
    this.routes.paramMap.subscribe(paramMap => {
      if (!paramMap.has("customerId")) {
        this.navCtrl.navigateBack("/customers");
        return;
      }
      this.customerService
        .getCustomer(paramMap.get("customerId"))
        .subscribe(customer => {
          this.customer = customer;
          if(!this.customer) {
            this.router.navigateByUrl('/auth');
          }
        });

      this.languageService.arabicLabel.subscribe(labels => {
        this.arabicLabels = labels;
      });

      this.form = new FormGroup({
        personalPic: new FormControl(this.customer.personalPic, {
          updateOn: "blur",
          validators: [Validators.required]
        }),
        title: new FormControl(this.customer.title, {
          updateOn: "blur",
          validators: [Validators.required]
        }),
        firstName: new FormControl(this.customer.firstName, {
          updateOn: "blur",
          validators: [Validators.required]
        }),
        lastName: new FormControl(this.customer.lastName, {
          updateOn: "blur",
          validators: [Validators.required]
        }),
        email: new FormControl(this.customer.email, {
          updateOn: "blur",
          validators: [Validators.required]
        }),
        password: new FormControl(this.customer.password, {
          updateOn: "blur",
          validators: [Validators.required]
        }),
        gender: new FormControl(this.customer.gender, {
          updateOn: "blur",
          validators: [Validators.required]
        }),
        birthday: new FormControl(this.customer.birthday, {
          updateOn: "blur",
          validators: [Validators.required]
        }),
        country: new FormControl(this.customer.country, {
          updateOn: "blur",
          validators: [Validators.required]
        }),
        city: new FormControl(this.customer.city, {
          updateOn: "blur",
          validators: [Validators.required]
        }),
        area: new FormControl(this.customer.area, {
          updateOn: "blur",
          validators: [Validators.required]
        }),
        address: new FormControl(this.customer.address, {
          updateOn: "blur",
          validators: [Validators.required]
        }),
        zipcode: new FormControl(this.customer.zipcode, {
          updateOn: "blur",
          validators: [Validators.required]
        }),
        phone: new FormControl(this.customer.phone, {
          updateOn: "blur",
          validators: [Validators.required]
        })
      });
    });
  }
  updateCustomer() {
    this.loadCtrl.create({ message: "Updating customer..." }).then(loadEl => {
      loadEl.present();

      const newCustomer = new Customer(
        this.customer.id,
        this.form.value.title,
        this.form.value.firstName,
        this.form.value.lastName,
        this.form.value.birthday,
        this.form.value.email,
        this.form.value.password,
        this.form.value.gender,
        this.form.value.country,
        this.form.value.city,
        this.form.value.area,
        this.form.value.address,
        this.form.value.zipcode,
        this.form.value.phone,
        this.form.value.personalPic,
        null
      );
      this.customerService.updateCustomer(newCustomer).subscribe(() => {
        loadEl.dismiss();
        this.router.navigateByUrl(`/auth`);
      });
    });
  }
}
