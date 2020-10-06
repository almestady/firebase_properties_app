
import { Component, OnInit, Input, ElementRef, ViewChild, forwardRef, OnDestroy, Renderer2 } from "@angular/core";

import { PropertiesService } from "../properties.service";


import {
  MenuController,
  IonItemSliding,
  ModalController,
  LoadingController,
  IonDatetime,
  ActionSheetController,
  NavController,
} from "@ionic/angular";
import { Router } from "@angular/router";
import { SegmentChangeEventDetail } from "@ionic/core";
import { Subscription } from "rxjs";
// import { EditPage } from "./edit/edit.page";
import { AuthService } from "src/app/auth.service";
import { Labels, LanguagesService } from "src/app/languages.service";


import { CreateBookingComponent } from "../search/bookings/create-booking/create-booking.component";
import { Property, Reservation, Booking, Like, View } from "../property.model";
import { environment } from "../../../environments/environment";
import { thistle } from "color-name";
import { MapModalComponent } from "../../shared/map-modal/map-modal.component";
import { Location } from "../location.model";
import { Storage } from '@ionic/storage';
import { BookingService } from 'src/app/bookings/booking.service';
import { LikesService } from 'src/app/shared/likes.service';
import { ViewsService } from 'src/app/shared/views/views.service';


@Component({
  selector: "app-search",
  templateUrl: "./search.page.html",
  styleUrls: ["./search.page.scss"],
})
export class SearchPage implements OnInit, OnDestroy {
  loadedProperties: Property[];
  listedloadedProperties: Property[];
  relevantProperties: Property[];
  propertiesSub: Subscription;
  bookingsSub: Subscription;
  likesSub: Subscription;
  userId: string;
  viewItem = false;
  viewItemAsCard = true;
  tempProperties: Property[];
  labels: Labels;
  labelsSub: Subscription;
  currentProperty: Property;
  like_heart = "gray";
  likeOn: boolean = false;
  updateSub: Subscription;
  redClickable: boolean = false;
  grayClickable: boolean = true;
  lastVisitedOffer: Property;
  lastVisitedProperty: Property;
  messages: boolean = false;
  listOfProperties: boolean = true;
  messageActive: boolean = false;
  mapActive: boolean = false;
  map: boolean = false;
  listActive: boolean = false;
  imageActive: boolean = false;
  image: boolean = false;
  bookmark: boolean = false;
  bookmarkActive: boolean = false;
  bookmarkOn: boolean = false;
  isLoading = false;
  bookings : Booking[] = [];
  isBooked = false;
  theBooking: Booking = null;
  loadedBookings: Booking[] = []
  likes: Like[] = []
  loadedLikes: Like[] =[]
  viewOn: boolean;
  views: View[];
  viewsSub: Subscription;
  loadedViews: View[] = [];

  constructor(
    private propertiesService: PropertiesService,
    private menuCtl: MenuController,
    private router: Router,
    private modalCtrl: ModalController,
    private loadCtrl: LoadingController,
    private authService: AuthService,
    private languageService: LanguagesService,
    private actionSheetCtrl: ActionSheetController,
    private auth: AuthService,
    private navCtrl: NavController,
    private storage: Storage,
    private bookingService: BookingService,
    private likesService: LikesService,
    private viewsService: ViewsService
  ) {
    // this.storage.getI('accessToken').then(token => {

      // if(!this.auth.accessToken){
        // this.loadCtrl.create({message:'I am loading...'}).then(loadEl => {
        //    loadEl.present()
          
             
          //  this.auth.login()
          //    loadEl.dismiss()
             
            
          // })
        
      // }
    // })
  }

 getLogin(){
setTimeout(function () {
  console.log('Timeout Login....');
  
   this.auth.login()
  
  this.timeout();
  }, 0);
}

  ngOnInit() {
    this.isLoading = true;
    console.log('Search Page init')
    this.labelsSub = this.languageService.arabicLabel.subscribe(
      (labels) => {this.labels = labels}
    );

      this.propertiesSub = this.propertiesService.properties.subscribe(
        (props) => {
          this.isLoading = false;
          
          console.log(props);
          this.listedloadedProperties = props;
            this.loadedProperties = this.listedloadedProperties;
            this.currentProperty = this.loadedProperties[0];
            
        }
        );
        this.bookingsSub = this.bookingService.bookings.subscribe(bookings => {
               this.loadedBookings = bookings
               this.bookings = this.loadedBookings
              //  this.theBooking = bookings.find(booking => booking.propertyId = this.currentProperty.id) ;
                console.log(this.bookings)
                
              })

              this.likesSub = this.likesService.likes.subscribe(likes => {
                this.loadedLikes = likes
                this.likes = this.loadedLikes.filter(like => like.guestId === this.authService.userId)
                console.log(this.likes)
               
                 console.log(this.likes)
                 if(this.currentProperty){
                  this.checkLike(this.currentProperty.id)
                  this.howManyLikes(this.currentProperty.id)
                }
               })

               this.viewsSub = this.viewsService.views.subscribe(views => {
                this.loadedViews = views
                this.views = this.loadedViews.filter(view => view.guestId === this.authService.userId)
                console.log(this.views)
               
                 
                 if(this.currentProperty){
                   this.onView(this.currentProperty.id)
                 this.checkView(this.currentProperty.id)
                 this.howManyViews(this.currentProperty.id)
                }
               })

           
  }

  ionViewWillEnter() {
    
    this.propertiesService.getProperties().subscribe(()=>{

      this.bookingService.getBookings().subscribe(()=> {})

    this.likesService.getLikes().subscribe()

    this.viewsService.getViews().subscribe()

   
      // this.checkBookmark(this.currentProperty)
    }); 
  }


  checkBookmark(id: string) {
    this.theBooking = null;
    this.isBooked = false;
    this.bookings.forEach(booking =>{
      console.log(booking)
      if(booking.propertyId === id){
        this.isBooked = true;
      } ;
    } )
      
   
    // console.log(this.theBooking)
  // if(this.theBooking.){
  //  console.log(this.currentProperty.id)
    // this.isBooked = true;
  // }

  }        
  

  clickedProperty(id: string) {
    // this.isBooked = true;
    console.log( id)
    this.propertiesService.getProperty(id).subscribe((property) => {
    
      this.currentProperty = property;
      this.checkBookmark(id)
      this.checkLike(id)
      this.checkView(id)
      this.onView(id)
    console.log(this.currentProperty.propertyName)
    });
   

    
        // if (this.currentProperty) {
        //   this.addView();
        //   this.checkLike();
        //   this.checkBookmark();
        // }
  }

  



  checkLike(id: string) {
    this.likeOn = false
    if (this.likes) {
      if (
        this.likes.find(
          (like) => like.propertyId === id
        )
      ) {
        this.likeOn = true;
      } else {
        this.likeOn = false;
        
      }
    }
  }

  checkView(id: string) {
    this.viewOn = false
    if (this.views) {
      if (
        this.views.find(
          (view) => view.propertyId === id
        )
      ) {
        this.viewOn = true;
      } else {
        this.viewOn = false;
        
      }
    }
  }

  
  howManyLikes(id: string){
    if(this.likes){
      let likes = this.loadedLikes.filter(like => like.propertyId === id)
      if(likes){
        if(likes.length === 0){
          return
        }
        return likes.length 
      }else{
        return 
      }
    }
  }
  
  howManyViews(id: string){
    if(this.views){
      let views = this.loadedViews.filter(view => view.propertyId === id)
      if(views){
        if(views.length === 0){
          return
        }
        return views.length 
      }else{
        return 
      }
    }
  }
  
  onLike(id: string, event: Event) {
    
    this.checkLike(this.currentProperty.id)
    // let theLike = this.likes.find(
    //   (like) => like.propertyId = id
    // )
    if (
      !this.likeOn 
    ) {
       let like = {
        id: '',
        propertyId: this.currentProperty.id,
        guestId: this.authService.userId,
        date: new Date(),
        time: new Date()
      }
      // this.likes.push(like);
      this.likesService.addLike(like)
      
      .subscribe(() => {
        this.likeOn = true;
        this.router.navigateByUrl(`/properties/tabs/discover`);
      });
      console.log("Like is been added");
    
    
  } else {
    this.likes.forEach((like, index) => {
      //  if( resv.customerId === this.authService.userId) {
        this.likes.splice(index, 1);
        this.likesService.cancelLike(like.id)
        .subscribe(() => {
          this.likeOn = false;
          this.router.navigateByUrl(`/properties/tabs/discover`);
        });

      //  }
    });
   
  }
}

onView(id: string){
  if(this.viewOn){
    return
  }

  let view = {
    id: '',
    propertyId: this.currentProperty.id,
    guestId: this.authService.userId,
    date: new Date(),
    time: new Date()
  }
  // this.likes.push(like);
  this.viewsService.addView(view)
  
  .subscribe(() => {
    this.viewOn = true;
    this.router.navigateByUrl(`/properties/tabs/discover`);
  });
  console.log(this.currentProperty.id + " is been viewed");

}

  onShowFullMap() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
        componentProps: {
          center: {
            lat: this.currentProperty.location.lat,
            lng: this.currentProperty.location.lng,
          },
          selectable: false,
          closeButtonText: "Close",
          title: this.currentProperty.location.address,
        },
      })
      .then((modlEl) => {
        modlEl.present();
      });
  }

  

  onBookMark() {
   
    if(!this.bookings.length){
     this.bookings = [];
    }
    
    if (!this.isBooked) {
      
      console.log(this.currentProperty.id)
      console.log(this.loadedBookings.filter(booking => booking.guestId = this.auth.userId))
      this.modalCtrl
        .create({
          component: CreateBookingComponent,
          componentProps: { bookedProperty: this.currentProperty },
        })
        .then((modalEl) => {
          modalEl.present();
          return modalEl.onDidDismiss();
        })
        .then((data) => {
          console.log(data.data);
          if(data.data){

            let booking = {
              id: '',
              propertyId: this.currentProperty.id,
              guestId: this.authService.userId,
              date: data.data.booking.date,
              time: data.data.booking.time
            }
            this.bookings.push(booking);
            this.bookingService
             .addBooking(booking)
              .subscribe(() => {
                this.isBooked = true;
                this.router.navigateByUrl(`/properties/tabs/discover`);
              });
          }
        });
    } else {
      console.log(this.bookings.find(booking => booking.guestId === this.auth.userId))
      this.actionSheetCtrl
        .create({
          header: this.labels.cancelBookingQuest,
          buttons: [
            {
              text: this.labels.ok,
              handler: () => {
                // this.bookmarkOn = false;
                this.bookings.forEach((resv, index) => {
                  //  if( resv.customerId === this.authService.userId) {
                    this.bookings.splice(index, 1);
                    this.bookingService.cancelBooking(resv.id)
                   .subscribe(() => {
                     this.isBooked = false
                      this.router.navigateByUrl(`/properties/tabs/discover`);
                    });

                  //  }
                });
              },
            },
            {
              text: this.labels.cancel,
              role: "cancel",
            },
          ],
        })
        .then((actionEl) => {
          actionEl.present();
        });
    }
  }

  onList() {
    this.listOfProperties = true;
    this.listActive = true;
    this.messageActive = false;
    this.messages = false;
    this.mapActive = false;
    this.map = false;
    this.imageActive = false;
    this.image = false;
  }

  onMessages() {
    this.messageActive = true;
    this.messages = true;
    this.listOfProperties = false;
    this.listActive = false;
    this.mapActive = false;
    this.map = false;
    this.imageActive = false;
    this.image = false;
  }

  onMap() {
    this.mapActive = true;
    this.listOfProperties = false;
    this.listActive = false;
    this.messageActive = false;
    this.messages = false;
    this.map = true;
    this.imageActive = false;
    this.image = false;
  }

  onImage() {
    this.imageActive = true;
    this.image = true;
    this.mapActive = false;
    this.map = false;
    this.listOfProperties = false;
    this.listActive = false;
    this.messageActive = false;
    this.messages = false;
  }

  

  // onBookMark_2() {
  //   if(!this.currentProperty.reservations){
  //     this.currentProperty.reservations = [];
  //   }
  //   if (!this.currentProperty.reservations.find(resv => resv.customerId = this.auth.userId)) {
  //     console.log(this.currentProperty.reservations.find(resv => resv.customerId = this.auth.userId))
  //     this.modalCtrl
  //       .create({
  //         component: CreateBookingComponent,
  //         componentProps: { bookedProperty: this.currentProperty },
  //       })
  //       .then((modalEl) => {
  //         modalEl.present();
  //         return modalEl.onDidDismiss();
  //       })
  //       .then((data) => {
  //         console.log(data.data);
  //         this.currentProperty.reservations.push({
  //           customerId: this.auth.userId,
  //           onDate: new Date(),
  //         });
  //         this.propertiesService
  //           .updateProperty(this.currentProperty)
  //           .subscribe(() => {
  //             this.bookmarkOn = true;
  //             this.router.navigateByUrl(`/properties/tabs/discover`);
  //           });
  //       });
  //   } else {
  //     console.log(this.currentProperty.reservations.find(resv => resv.customerId = this.auth.userId))
  //     this.actionSheetCtrl
  //       .create({
  //         header: this.labels.cancelBookingQuest,
  //         buttons: [
  //           {
  //             text: this.labels.ok,
  //             handler: () => {
  //               this.bookmarkOn = false;
  //               this.currentProperty.reservations.forEach((resv, index) => {
  //                 //  if( resv.customerId === this.authService.userId) {
  //                 this.currentProperty.reservations.splice(index, 1);
  //                 this.propertiesService
  //                   .updateProperty(this.currentProperty)
  //                   .subscribe(() => {
  //                     this.router.navigateByUrl(`/properties/tabs/discover`);
  //                   });

  //                 //  }
  //               });
  //             },
  //           },
  //           {
  //             text: this.labels.cancel,
  //             role: "cancel",
  //           },
  //         ],
  //       })
  //       .then((actionEl) => {
  //         actionEl.present();
  //       });
  //   }
  // }

  onOpenMenu() {
    this.menuCtl.toggle();
  }

  onEdit(id: number, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigateByUrl(`/properties/tabs/offers/edit/${id}`);
    console.log("Editing item:", id);
  }
  onChange(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);
  }
  itemAsCard() {
    if (this.viewItemAsCard) {
      this.viewItem = true;
      this.viewItemAsCard = false;
    } else if (this.viewItem) {
      this.viewItemAsCard = true;
      this.viewItem = false;
    }
  }

  pressLike(id: string) {
    // this.propertiesService.getProperty(id).subscribe(property => {
    //   property.likes.push(new Like(this.authService.userId, new Date()));
    //   this.currentProperty = property;
    // });
    this.propertiesService.updateProperty(this.currentProperty).subscribe();
    console.log(this.likes.length);
  }

  

  ngOnDestroy() {
    if (this.propertiesSub) {
      this.propertiesSub.unsubscribe();
    }
    if (this.bookingsSub) {
      this.bookingsSub.unsubscribe();
    }
  }
}

// @ViewChild('inlineEditControl') inlineEditControl; // input DOM element
//   @Input() label: string = '';  // Label value for input element
//   @Input() type: string = 'text'; // The type of input element
//   @Input() required: boolean = false; // Is input requried?
//   @Input() disabled: boolean = false; // Is input disabled?
//   private _value: string = ''; // Private variable for input value
//   private preValue: string = ''; // The value before clicking to edit
//   private editing: boolean = false; // Is Component in edit mode?
//   public onChange: any = Function.prototype; // Trascend the onChange event
//   public onTouched: any = Function.prototype;

//   get value(): any {
//     return this._value;
//   }

//   set value(v: any) {
//     if (v !== this._value) {
//       this._value = v;
//       this.onChange(v);
//     }
//   }

//   // Required for ControlValueAccessor interface
//   writeValue(value: any) {
//     this._value = value;
//   }

//   // Required forControlValueAccessor interface
//   public registerOnChange(fn: (_: any) => {}): void {
//     this.onChange = fn;
//   }

//   // Required forControlValueAccessor interface
//   public registerOnTouched(fn: () => {}): void {
//     this.onTouched = fn;
//   }

//   onBlur($event: Event) {
//     this.editing = false;
//   }

//   // Start the editting process for the input element
//   edit(value) {
//     if (this.disabled) {
//       return;
//     }

//     this.preValue = value;
//     this.editing = true;
//     // Focus on the input element just as the editing begins
//     setTimeout(_ => this._renderer.invokeElementMethod(this.inlineEditControl,
//       'focus', []));
//   }
