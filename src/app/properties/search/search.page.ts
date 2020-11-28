
import { ChatPage } from './../chat/chat.page';
import { async } from '@angular/core/testing';
import { switchMap, take } from 'rxjs/operators';

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
import { ActivatedRoute, Router } from "@angular/router";
import { SegmentChangeEventDetail } from "@ionic/core";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
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
  liked: boolean;
  _likeOn = new BehaviorSubject<boolean> (false);
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
  @Input()theProperty: Property;
  propertyId: string
  currentLike: Like;

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
    private viewsService: ViewsService,
    private routes: ActivatedRoute
  ) {
    // this.storage.getI('accessToken').then(token => {

      // if(!this.auth.accessToken){
        // this.loadCtrl.create({message:'I am loading...'}).then(loadEl => {
        //    loadEl.present()
          
             
          //  this.auth.login()
          //    loadEl.dismiss()
             
            
          // })
        
      // }
    // }
  }

 getLogin(){
setTimeout(function () {
  console.log('Timeout Login....');
  
   this.auth.login()
  
  this.timeout();
  }, 0);
}

get likeOn(){
  return this._likeOn.asObservable()
}

  ngOnInit() {
    this.isLoading = true;
    this.onImage()
   
    // this.routes.paramMap.subscribe(paramMap => {
    //   if (!paramMap.has('propertyId')) {
    //     this.navCtrl.navigateBack('/properties/tabs/discover');

    //     console.log("no paramMap")
    //     return;
    //   }
    //   this.propertyId = paramMap.get('propertyId')
    //   this.propertiesService.getProperty(paramMap.get('propertyId')).subscribe(prop => {
    //     console.log(prop)
    //     this.theProperty = prop});
    // });     
   console.log(this.theProperty.id)
    // this.authService.userId.subscribe(userId => {
    //   this.userId = userId;
      
    // })
   
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
            // this.theProperty = this.loadedProperties[0];
            
        }
        );
        this.bookingsSub = this.bookingService.bookings.subscribe((bookings) => {
               this.loadedBookings = bookings
               this.bookings = this.loadedBookings
              //  this.theBooking = bookings.find(booking => booking.propertyId = this.theProperty.id) ;
                console.log(this.bookings)
                
              })
              // this.authService.userId.pipe(take(1))
              //  .subscribe(userId => {
              //    if(!userId){
              //      throw Error('Could not find userId')
              //    }
                 this.likesSub = this.likesService.likes.subscribe((likes) => {
                  this.loadedLikes= likes
                  this.likes = this.loadedLikes.filter(like => like.guestId === this.authService.currentUserId);
                  
                  // console.log(this.likes.length)
               })
               
              //  if(this.theProperty){
              //    this.onLike(this.theProperty.id)
               this.checkLike(this.theProperty.id)
               this.howManyLikes(this.theProperty.id)
              // }

                 this.viewsSub = this.viewsService.views.subscribe((views) => {
                  this.loadedViews = views
                  this.views =  this.loadedViews.filter(view => view.guestId === this.authService.currentUserId)
                  // console.log(this.views.length)
               })
               
              //  if(this.theProperty){
                 this.onView(this.theProperty.id)
               this.checkView(this.theProperty.id)
               this.howManyViews(this.theProperty.id)
              // }

            
                 
              //  })
    // this._likeOn.subscribe(isLiked => {
    //   this.liked = isLiked;
    // })
           
  }

  ionViewWillEnter() {
    this._likeOn.subscribe()
    this.likesService.getLikes()
    this.viewsService.getViews()
    this.checkView(this.theProperty.id)
    this.checkLike(this.theProperty.id)
    this.checkBookmark(this.theProperty.id)
    // this.propertiesService.getProperties().subscribe(()=>{

    //   this.bookingService.getBookings().subscribe(()=> {
    //     if(this.theProperty){
    //       this.checkBookmark(this.theProperty.id)
    //     }
    //   })

    // this.likesService.getLikes().subscribe(()=> {
    //   if(this.theProperty){
    //     this.checkLike(this.theProperty.id)
    //   }
    // })

    // this.viewsService.getViews().subscribe(()=>{
    //   if(this.theProperty){
    //     this.checkView(this.theProperty.id)
    //   }
    // })
    //   // this.checkBookmark(this.theProperty)
    // }); 
  }




  checkBookmark(id: string) {
    this.theBooking = null;
    this.isBooked = false;

  // return  this.authService.userId.pipe(take(1)).subscribe(userId => {
  //     if(!userId){
  //       throw new Error('No user id found');
  //     }

      this.bookings.forEach(booking =>{
        console.log(booking)
        if(booking.propertyId === id && booking.guestId === this.authService.currentUserId){
          this.isBooked = true;
        } ;
      } )
    // })
      
   
    // console.log(this.theBooking)
  // if(this.theBooking.){
  //  console.log(this.theProperty.id)
    // this.isBooked = true;
  // }

  }        
  

  clickedProperty(id: string) {
    // this.isBooked = true;
    console.log( id)
    this.checkBookmark(id)
    this.checkLike(id)
    this.checkView(id)
    this.onView(id)
    this.propertiesService.getProperty(id).subscribe((doc) => {
    
      this.theProperty = doc;
    console.log(this.theProperty.propertyName)
    });
   

    
        // if (this.theProperty) {
        //   this.addView();
        //   this.checkLike();
        //   this.checkBookmark();
        // }
  }

  



  checkLike(id: string) {
    this.liked = false
    console.log(this.likes.length)
    // this.authService.userId.pipe(take(1)).subscribe(userId => {
    //    if(!userId){
    //      return
    //    }
      this.likesService.likes.subscribe(likes => {
  
        if (likes) {
          let myLikes = likes.filter(like => like.guestId === this.authService.currentUserId)
          let currentLike = myLikes.find((like) => like.propertyId === id)
          
          console.log(currentLike)
          if (currentLike)
           {
    
            this.liked = true;
          } else {
            this.liked = false;
            
          }
        }
      })
    // })
    // if (this.likes) {
    //     this.currentLike =this.likes.find((like) => like.propertyId === id)
    //     if (this.currentLike) {
    //     this._likeOn.next(true);
    //   } else{
    //     this._likeOn.next(false);
    //   }
      
    // }
  }

  checkView(id: string) {
    this.viewOn = false
    // console.log(this.views.length)
    if (this.views) {
      let currentView = this.views.find((view) => view.propertyId === id)
      if (currentView)
       {
        console.log(currentView)
        this.viewOn = true;
      } else {
        this.viewOn = false;
        
      }
    }
  }

  
  howManyLikes(id: string){
    if(this.likes){
      let likes = this.likes.filter(like => like.propertyId === id)
      if(likes){
        if(likes.length === 0){
          return
        }
        return likes.length 
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
  
  onLike(id: string) {
    
    // this.checkLike(this.theProperty.id)
    // let theLike = this.likes.find(
    //   (like) => like.propertyId = id
    // )
    // this.authService.userId.pipe(take(1)).subscribe(userId => {
    //   if(!userId){
    //     throw new Error('No user id found');
    //   }
            if (
              !this.liked 
              ) {
        let like = {
         id: '',
         propertyId: this.theProperty.id,
         guestId: this.authService.currentUserId,
         date: new Date(),
         time: new Date()
       }
       this.likesService.addLike(like)
       .subscribe(() => {
        // this.likes.push(like);
         this.liked = true;
         // this.router.navigateByUrl(`/properties/tabs/browser`);
       });
       console.log("Like is been added");
      } else {
        this.likes.forEach((like, index) => {
           if( like.guestId === this.authService.currentUserId && like.propertyId === id) {
            this.likes.splice(index, 1);
            this.likesService.cancelLike(like.id)
            .subscribe(() => {
              this.liked = false;
              return
              // this.router.navigateByUrl(`/properties/tabs/browser`);
              
            });
          }
    
          //  }
        });
      }
      // })
    
    
   
}

//   onLike(id: string) {
    
//     // this.checkLike(this.theProperty.id)
//     // let theLike = this.likes.find(
//     //   (like) => like.propertyId = id
//     // )
    
//     this.authService.userId.pipe(take(1)).subscribe(userId => {
//       if(!userId){
//         throw new Error('No user id found');
//       }
//       this.checkLike(id)
      
//             if (!this.liked) {
//         let like = {
//          id: '',
//          propertyId: this.theProperty.id,
//          guestId: userId,
//          date: new Date(),
//          time: new Date()
//        }

      
//          this.likesService.addLike(like)
       
//           // this.likes.push(like);
//            this.liked = true;
//            // this.router.navigateByUrl(`/properties/tabs/browser`);
         
       
//        console.log("Like is been added");
//       } else {
//         this.likes.forEach((like, index) => {
//            if( like.guestId === userId && like.propertyId === id) {
//             this.likes.splice(index, 1);
//             this.likesService.cancelLike(like.id)
//             .subscribe(() => {
//               this.liked = false;
//               return
//               // this.router.navigateByUrl(`/properties/tabs/browser`);
              
//             });
//           }
    
//           //  }
//         });
//       }
//       })
    
    
   
// }

ionViewWillLeave(){
  this.propertiesService.getProperties().subscribe()
  this.likesService.getLikes().subscribe()
  this.viewsService.getViews().subscribe()
}

onView(id: string){
  // if(this.viewOn){
  //   return
  // }
// this.authService.userId.pipe(take(1)).subscribe(userId => {
//   if(!userId){
//     throw new Error('No user id found');
//   }
  let view: View = {
    id: '',
    propertyId: this.theProperty.id,
    guestId: this.authService.currentUserId,
    date: new Date(),
    time: new Date()
  }
  // this.likes.push(like);
  this.viewsService.addView(view)
  .subscribe(() => {
    this.viewOn = true;
    // this.router.navigateByUrl(`/properties/tabs/browser`);
  });
  console.log(this.theProperty.id + " is been viewed");
// })

}

  onShowFullMap() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
        componentProps: {
          center: {
            lat: this.theProperty.location.lat,
            lng: this.theProperty.location.lng,
          },
          selectable: false,
          closeButtonText: "Close",
          title: this.theProperty.location.address,
        },
      })
      .then((modlEl) => {
        modlEl.present();
      });
  }

  goBack(){
    this.modalCtrl.dismiss('theProperty');
      
  }

  onBookMark(id: string) {
    let fetchedBooking:string;
    if(!this.bookings.length){
     this.bookings = [];
    }
    
    
    if (!this.isBooked) {
      console.log(this.theProperty.id)
      // console.log(this.loadedBookings.filter(booking => booking.guestId = this.auth.userId))
      this.modalCtrl
        .create({
          component: CreateBookingComponent,
          componentProps: { bookedProperty: this.theProperty },
        })
        .then((modalEl) => {
          modalEl.present();
          return modalEl.onDidDismiss();
        })
        .then((data) => {
          console.log(data.data);
          if(data.data){
            // this.authService.userId.pipe(take(1)).subscribe(userId => {
            //    if(!userId){
            //     throw new Error('No user id found');
            //    }
                // fetchedBooking = this.authService.currentUserId
              let booking = {
                id: '',
                propertyId: this.theProperty.id,
                guestId: this.authService.currentUserId,
                date: data.data.booking.date,
                time: data.data.booking.time
              }
              this.bookings.push(booking);
              this.bookingService
               .addBooking(booking)
                .subscribe(() => {
                  this.isBooked = true;
                  // this.router.navigateByUrl(`/properties/tabs/discover`);
                });
            // })
          }
        });
      }else {
        this.actionSheetCtrl
        .create({
          header: this.labels.cancelBookingQuest,
          buttons: [
            {
              text: this.labels.ok,
              handler: () => {
                // this.bookmarkOn = false;
                // this.authService.userId.pipe(take(1)).subscribe(userId => {
                //   if (!userId) {
                //     throw new Error('User not found!');
                //   }
                  this.bookings.forEach((booking, index) => {
                    if( booking.guestId === this.authService.currentUserId && booking.propertyId === id) {
                      console.log("Hello...there...")
                    this.bookings.splice(index, 1);
                    this.bookingService.cancelBooking(booking.id)
                      .subscribe(() => {
                      this.isBooked = false;
                      return;
                      });
  
                     }
                  })
                // })
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

  onList(property: Property) {
    // this.router.navigateByUrl(`properties/tabs/browser/chat`)

      this.modalCtrl.create({component: ChatPage, componentProps: {userId: this.authService.user.uid, theProperty: property}, id:'chat'})
      .then(modalEl => { 
        modalEl.present();
        return modalEl.onDidDismiss();
      })

    
    // this.listOfProperties = true;
    // this.listActive = true;
    // this.messageActive = false;
    // this.messages = false;
    // this.mapActive = false;
    // this.map = false;
    // this.imageActive = false;
    // this.image = false;
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
  //   if(!this.theProperty.reservations){
  //     this.theProperty.reservations = [];
  //   }
  //   if (!this.theProperty.reservations.find(resv => resv.customerId = this.auth.userId)) {
  //     console.log(this.theProperty.reservations.find(resv => resv.customerId = this.auth.userId))
  //     this.modalCtrl
  //       .create({
  //         component: CreateBookingComponent,
  //         componentProps: { bookedProperty: this.theProperty },
  //       })
  //       .then((modalEl) => {
  //         modalEl.present();
  //         return modalEl.onDidDismiss();
  //       })
  //       .then((data) => {
  //         console.log(data.data);
  //         this.theProperty.reservations.push({
  //           customerId: this.auth.userId,
  //           onDate: new Date(),
  //         });
  //         this.propertiesService
  //           .updateProperty(this.theProperty)
  //           .subscribe(() => {
  //             this.bookmarkOn = true;
  //             this.router.navigateByUrl(`/properties/tabs/discover`);
  //           });
  //       });
  //   } else {
  //     console.log(this.theProperty.reservations.find(resv => resv.customerId = this.auth.userId))
  //     this.actionSheetCtrl
  //       .create({
  //         header: this.labels.cancelBookingQuest,
  //         buttons: [
  //           {
  //             text: this.labels.ok,
  //             handler: () => {
  //               this.bookmarkOn = false;
  //               this.theProperty.reservations.forEach((resv, index) => {
  //                 //  if( resv.customerId === this.authService.userId) {
  //                 this.theProperty.reservations.splice(index, 1);
  //                 this.propertiesService
  //                   .updateProperty(this.theProperty)
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
    //   this.theProperty = property;
    // });
    this.propertiesService.updateProperty(this.theProperty).subscribe();
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
