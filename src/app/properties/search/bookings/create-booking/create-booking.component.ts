import { Component, OnInit, Input } from '@angular/core';
import { Property, Booking } from 'src/app/properties/property.model';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth.service';
import { CustomerService } from 'src/app/customers/customer.service';
import { Customer } from 'src/app/customers/customer.model';
import { LanguagesService, Labels } from 'src/app/languages.service';


import { PropertiesService } from 'src/app/properties/properties.service';
import { BookingService } from 'src/app/bookings/booking.service';
import { take } from 'rxjs/operators';



@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss']
})
export class CreateBookingComponent implements OnInit {
@Input() bookedProperty: Property;
form: FormGroup;
customer: Customer;
arabiceLabels: Labels;
booking: Booking;

  constructor(
    private router: Router,
    private modalCtl: ModalController,
    private authService: AuthService,
    private customerServie: CustomerService,
    private languageService: LanguagesService,
    private bookingService: BookingService,
    private propertiesService: PropertiesService
  ) { }

  ngOnInit() {
    console.log(this.bookedProperty.propertyName);
    this.authService.userId.pipe(take(1)).subscribe(userId => {

      this.customerServie.getCustomer(userId).subscribe(customer => {
        this.customer = customer;
      });   
    })

   this.languageService.arabicLabel.subscribe(labels => {

     this.arabiceLabels = labels;
   });

    this.form = new FormGroup({
      firstName: new FormControl(null, {
        updateOn: "blur",
        validators: [Validators.required]
      }),
    startDate: new FormControl(null,{
      updateOn: 'blur',
      validators: [Validators.required]
    }),
    startTime: new FormControl(null,{
      updateOn: 'blur',
      validators: [Validators.required]
    })
  });

  }
  
  bookingInfo(){
    console.log(this.bookedProperty)
    this.authService.userId.pipe(take(1)).subscribe(userId => {
      if(!userId){
        throw Error('could not find userId')
      }
      this.booking = {
        id: '',
        propertyId: this.bookedProperty.id,
        guestId: userId,
        date: this.form.value.startDate,
        time: this.form.value.startTime
      }
    })
  }
  onBookProperty() {
    this.bookingInfo()
    // this.bookingService.addBooking(this.booking)
    // .subscribe((insertedId: any) => {
    //   console.log(insertedId)
    // })
    // const id = this.customer.id + this.bookedProperty.id + new Date().getTime().toString;
    // console.log(id);
    // this.booking = new Booking('book1', this.bookedProperty,id, 0, this.form.value.startDate);
    
    this.modalCtl.dismiss( {'booking': this.booking}, 'confirm');
   
    
  }

  onCancel() {
   this.modalCtl.dismiss(null, 'cancel');
  }

}
