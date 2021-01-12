import { RatesService } from './../rates.service';

import { OffersComponent } from './../offers/offers.component';
import { Group, GroupsService } from './../chat/groups.service';
import { ChatDetailPage } from './../chat/chat-detail/chat-detail.page';
import { ChatService } from 'src/app/services/chat.service';

import { ChatPage, User } from './../chat/chat.page';
import { async } from '@angular/core/testing';
import { map, switchMap, take, tap, retry } from 'rxjs/operators';

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
  AlertController,
} from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { SegmentChangeEventDetail } from "@ionic/core";
import { BehaviorSubject, forkJoin, from, Observable, Subscription } from "rxjs";
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
import { AngularFirestore } from '@angular/fire/firestore';
import { OffersService } from '../offers.service';

interface Rate{
  id: string;
  stars: number;
  userId: string;
  propertyId: string;
  date: Date;
}

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
  views: View[] = [];
  viewsSub: Subscription;
  loadedViews: View[] = [];
  // @Input()
  theProperty: Property ;
  propertyId: string
  currentLike: Like;
  users = [] ;
  rates: Rate [] = [];
  
  star_1_half: boolean;
  star_1_full: boolean;
  star_1_empty: boolean;

  star_2_half: boolean;
  star_2_full: boolean;
  star_2_empty: boolean;

  star_3_half: boolean;
  star_3_full: boolean;
  star_3_empty: boolean;

  star_4_half: boolean;
  star_4_full: boolean;
  star_4_empty: boolean;

  star_5_half: boolean;
  star_5_full: boolean;
  star_5_empty: boolean;

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
    private routes: ActivatedRoute,
    private chatService: ChatService,
    private afs: AngularFirestore,
    private groupsService: GroupsService,
    private actionSheetController: ActionSheetController,
    public alertCtrl: AlertController, 
    private offersService: OffersService,
    private ratesService: RatesService
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
  
    this.getPropertyRates()

    this.routes.paramMap.subscribe(paramMap => {
      if (!paramMap.has('propertyId')) {
        
        this.navCtrl.navigateBack('/properties/tabs/browser');
        
        console.log("no paramMap")
        return;
      }
      this.propertyId = paramMap.get('propertyId')
      this.propertiesService.getProperty(paramMap.get('propertyId')).subscribe(prop => {
        console.log('This is the Property .....',prop)
        this.theProperty = {
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
                                       
        }
       this.isLoading = false;
       this.onView(this.theProperty.id)
       this.getPropertyRates();
      });
    });     
   console.log(this.theProperty)
   
   
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
               this.theBooking = bookings.find(booking => booking.propertyId === this.theProperty.id) ;
                console.log(this.bookings)
                
              })
              // this.authService.userId.pipe(take(1))
              //  .subscribe(userId => {
              //    if(!userId){
              //      throw Error('Could not find userId')
              //    }
                 this.likesSub = this.likesService.likes.subscribe((likes) => {
                  this.loadedLikes= likes
                  this.loadedLikes = this.loadedLikes.filter(like => like.propertyId === this.theProperty.id)
                  this.likes = this.loadedLikes.filter(like => like.guestId === this.authService.currentUserId);
                  
                  // console.log(this.likes.length)
                  this.checkLike(this.theProperty.id)
                  this.howManyLikes(this.theProperty.id)
               })
               
              //  if(this.theProperty){
              //    this.onLike(this.theProperty.id)
              // }

                 this.viewsSub = this.viewsService.views.subscribe((views) => {
                  this.loadedViews = views
                  this.views =  this.loadedViews.filter(view => view.guestId === this.authService.currentUserId)
                  // console.log(this.views.length)
                  this.checkView(this.theProperty.id)
                  this.howManyViews(this.theProperty.id)
                })
                this.onView(this.theProperty.id)
               
                // this.ratesService.getRates()
              //  if(this.theProperty){
              // }

            
                 
              //  })
    // this._likeOn.subscribe(isLiked => {
    //   this.liked = isLiked;
    // })
           
  }

  ionViewWillEnter() {
    // this.ratesService.getRates()
    this._likeOn.subscribe()
    this.likesService.getLikes()
    this.viewsService.getViews()
    this.onView(this.theProperty.id)
    this.checkView(this.theProperty.id)
    this.checkLike(this.theProperty.id)
    this.checkBookmark(this.theProperty.id)

    this.getPropertyRates()
    
    

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

goToBrowser(){
  this.router.navigateByUrl(`properties/tabs/browser`)
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
  

  // clickedProperty(id: string) {
  //   // this.isBooked = true;
  //   console.log( id)
  //   this.checkBookmark(id)
  //   this.checkLike(id)
  //   this.checkView(id)
  //   this.onView(id)
  //   this.propertiesService.getProperty(id).subscribe((doc) => {
    
  //     this.theProperty = doc;
  //   console.log(this.theProperty.propertyName)
  //   });
   

    
  //       // if (this.theProperty) {
  //       //   this.addView();
  //       //   this.checkLike();
  //       //   this.checkBookmark();
  //       // }
  // }

  



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
       .subscribe((k) => {
        // this.likes.push(like);
         this.liked = true;
         return;
         // this.router.navigateByUrl(`/properties/tabs/browser`);
       });
       console.log("Like is been added");
      } else {
        this.likes.forEach((like, index) => {
           if( like.propertyId === id) {
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
  this.propertiesService.getProperties()
  this.likesService.getLikes().subscribe()
  this.viewsService.getViews().subscribe()
}

onView(id: string){
this.viewsService.views.subscribe(views => {
  let currentView = views.filter(view => view.guestId === this.authService.currentUserId)
  console.log('This view test...', currentView.find(view => view.propertyId === id ))
  if(!currentView.find(view => view.propertyId === id)){
  
    let view: View = {
      id: '',
      propertyId: id,
      guestId: this.authService.currentUserId,
      date: new Date(),
      time: new Date()
    }
    // this.likes.push(like);
    this.viewsService.addView(view)
    .subscribe(() => {
      this.viewOn = true;
      // this.router.navigateByUrl(`/properties/tabs/browser`);
      return;
    });
    console.log(this.theProperty.id + " is been viewed");
  // })
  }
})


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
    // this.modalCtrl.dismiss('theProperty');
    this.navCtrl.navigateBack('properties/tabs/browser')
      
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

 

  showPrompt() {
    let prompt = this.alertCtrl.create({
      message: "الرجاء تحديد سعر تراه مناسبا للمنتج، وشكرا",
      inputs: [
        {
          name: 'offerPrice',
          placeholder: 'سعر المنتج',
        },
      ],
      buttons: [
        {
          text: 'التراجع',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'إرسال',
          handler: data => {
            console.log('Saved clicked', data.offerPrice);
            this.onOk(data.offerPrice)
            // document.getElementById("isi").innerHTML = data.password;
          }
        }
      ]
    });
    prompt.then(altEl => {
      altEl.present();
    });

  }

  onOk(offerPrice: number){
  //  this.offersService.offers()
    let offer = {
      createdAt: new Date(),
      propertyId: this.theProperty.id,
      userId: this.authService.currentUserId,
      offerPrice: offerPrice,
    }
     
    this.offersService.addOffer(offer).subscribe(offer =>{
      
    })
  }
  
  async onOffer() {
    this.modalCtrl.create({component: OffersComponent,
       componentProps: {theProperty: this.theProperty},
       id:'offer'})
    .then(modalEl => { 
      modalEl.present();
      return modalEl.onDidDismiss();
    })
      // const actionSheet = await this.actionSheetController.create({
      //   header: 'ضع سعرك هنا',
      //   cssClass: 'my-custom-class',
      //   buttons: [{
      //     text: 'Delete',
      //     role: 'destructive',
      //     icon: 'trash',
      //     handler: () => {
      //       console.log('Delete clicked');
      //     }
      //   }, {
      //     text: 'Cancel',
      //     icon: 'close',
      //     role: 'cancel',
      //     handler: () => {
      //       console.log('Cancel clicked');
      //     }
      //   }]
      // });
      // await actionSheet.present();
    }
  
    onRate(no_of_stars: number){
      this.ratesService.rates.pipe(take(1),map(rates => {
        this.rates = rates;
       
        this.rates.filter(rate => rate.userId === this.authService.currentUserId);
        if(this.rates.length){
          // let theRates = this.rates.slice(1);
          console.log('All the Rates........', this.rates)
          if(this.rates.find(rate => rate.propertyId === this.theProperty.id)){
            console.log('Sorry!!! You have already rated this property')
            
            this.alertCtrl.create({
             message: "لقد قمت مسبقا بتقييم المنتج. قل ترغب بإلغائه ؟",
             // inputs: [
             //   {
             //     name: 'stars',
             //     placeholder: 'سعر المنتج',
             //   },
             // ],
             buttons: [
               {
                 text: 'التراجع',
                 handler: data => {
                   console.log('Cancel clicked');
                 }
               },
               {
                 text: 'إلغاء التقييم',
                 handler: data => {
                   this.rates.forEach((rate, index) => {
                     if( rate.propertyId === this.theProperty.id) {
                       this.rates.splice(index, 1);
                       this.ratesService.cancelRate(rate.id)
                       .subscribe(() => {
                         console.log('تم الإلغاء');
                         this.getPropertyRates()
                        return;
                      })
                   
                   // document.getElementById("isi").innerHTML = data.password;
                 }
               })
                 }
               }
             ]
           }).then(loadEl => {loadEl.present();})
          } else {
            this.askForRate(no_of_stars);
           }
        }else {
          this.askForRate(no_of_stars);
         }
      
      })).subscribe()
          
     
  
    }

    askForRate(no_of_stars: number){
      this.alertCtrl.create({
        message:  ` من خمس نجمات \:  \" ${no_of_stars} \"  هو تقييمك للمنتج  `  ,
        
        buttons: [
          {
            text: 'التراجع',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'موافق',
            handler: data => {
              console.log('Saved clicked', no_of_stars);
              // this.ratesService.getRates()
              this.addARate(no_of_stars)
              
              // document.getElementById("isi").innerHTML = data.password;
            }
          }
        ]
      }).then(altEl => {
        altEl.present();
      });
    }

    addARate(stars: number){
      let done: boolean;
      // this.ratesService.getRates()
  

      this.ratesService.rates.pipe(take(1),map(rates => {
        this.rates = rates;
       
        this.rates.filter(rate => rate.userId === this.authService.currentUserId);
        if(this.rates.length){
          // let theRates = this.rates.slice(1);
          console.log('All the Rates........', this.rates)
          if(!this.rates.find(rate => rate.propertyId === this.theProperty.id)){
            let myrate={
              id: '',
              stars: stars,
              date: new Date(),
              propertyId: this.theProperty.id,
              userId: this.authService.currentUserId,
              
            }
            this.ratesService.addRate(myrate).subscribe(()=> {
              console.log('Rate is added')
            })
            this.getPropertyRates()
            return;
          } 
         
        }
         
       else {

        let myrate = {
          id: '',
          stars: stars,
          date: new Date(),
          propertyId: this.theProperty.id,
          userId: this.authService.currentUserId,
        }

        this.ratesService.addRate(myrate).pipe(take(1),map(()=> {
          console.log('Rate is added')
          this.getPropertyRates()
        })).subscribe()
      }
        return rates;
      })).subscribe(rates => {
        // if(this.rates.length !== 0 ){
         
        })
    }


    getPropertyRates(){
     
        let no_of_5 = 0;
        let no_of_4 = 0;
        let no_of_3 = 0;
        let no_of_2 = 0;
        let no_of_1 = 0;
      
       
        let theRates: Rate[] = [];
        this.ratesService.rates.pipe(take(1),map(rates => {
          // console.log(rates, 'That\'s right')
          rates.forEach(rate => {
            if(rate.propertyId === this.theProperty.id){
              theRates.push(rate)
            }
          })
          if(theRates){
            theRates.forEach(rate => {
              if(rate.stars === 5){
                no_of_5= +1;
                console.log(no_of_5)
              }
              if(rate.stars === 4){
                no_of_4 = +1;
                console.log(no_of_4)
              }
              if(rate.stars === 3){
                no_of_3 = +1;
                console.log(no_of_3)
              }
              if(rate.stars === 2){
                no_of_2 = +1;
                console.log(no_of_2)
              }          
              if(rate.stars === 1){
                no_of_1 = +1
                console.log(no_of_1)
              } 
            })
          }
          let rate = (5*no_of_5 + 4*no_of_4 + 3*no_of_3 + 2*no_of_2 + 1*no_of_1) / (no_of_5+no_of_4+no_of_3+no_of_2+no_of_1)
          // let rate = 5 * no_of_5
          return rate
        })).subscribe((rate)=>{
          
          this.calculateStars(rate);
          console.log('The rating is:  ', rate)
        })
 
    }

    calculateStars(rate: number) {
      let stars: number;

      this.star_1_half = false;
      this.star_1_full = false;
      this.star_1_empty = true;
    
      this.star_2_half = false;
      this.star_2_full = false;
      this.star_2_empty = true;
    
      this.star_3_half = false;
      this.star_3_full = false;
      this.star_3_empty = true;
    
      this.star_4_half = false;
      this.star_4_full = false;
      this.star_4_empty = true;
    
      this.star_5_half = false;
      this.star_5_full = false;
      this.star_5_empty = true;


      if(rate === 0){ stars = 0} 
      if(rate === 1){
         stars = 1;
        this.star_1_full = true;
        this.star_2_full = false;
        this.star_3_full = false;
        this.star_4_full = false;
        this.star_5_full = false;

        this.star_1_empty = false;
        this.star_2_empty = true;
        this.star_3_empty = true;
        this.star_4_empty = true;
        this.star_5_empty = true;
        }

      if(rate === 2){ 
        stars = 2;
        this.star_1_full = true;
        this.star_2_full = true;
        this.star_3_full = false;
        this.star_4_full = false;
        this.star_5_full = false;

        this.star_1_empty = false;
        this.star_2_empty = false;
        this.star_3_empty = true;
        this.star_4_empty = true;
        this.star_5_empty = true;
      
      }
      
      if(rate === 3){ 
        stars = 3;
        this.star_1_full = true;
        this.star_2_full = true;
        this.star_3_full = true;
        this.star_4_full = false;
        this.star_5_full = false;

        this.star_1_empty = false;
        this.star_2_empty = false;
        this.star_3_empty = false;
        this.star_4_empty = true;
        this.star_5_empty = true;
      
      }
      if(rate === 4){ 
        stars = 4;
        this.star_1_full = true;
        this.star_2_full = true;
        this.star_3_full = true;
        this.star_4_full = true;
        this.star_5_full = false;

        this.star_1_empty = false;
        this.star_2_empty = false;
        this.star_3_empty = false;
        this.star_4_empty = false;
        this.star_5_empty = true;

      }

      if(rate === 5){ 
        stars = 5;
        this.star_5_full = true;
        this.star_1_full = true;
        this.star_2_full = true;
        this.star_3_full = true;
        this.star_4_full = true;

        this.star_1_empty = false;
        this.star_2_empty = false;
        this.star_3_empty = false;
        this.star_4_empty = false;
        this.star_5_empty = false;
      }

      if(rate > 0 && rate < 1) { 
        stars = 0.5; 
        this.star_1_half = true;
        
        this.star_2_half = false;
        this.star_3_half = false;
        this.star_4_half = false;
        this.star_5_half = false;
        
        this.star_1_full = false;
        this.star_2_full = false;
        this.star_3_full = false;
        this.star_4_full = false;
        this.star_5_full = false;

        this.star_1_empty = false;
        this.star_2_empty = true;
        this.star_3_empty = true;
        this.star_4_empty = true;
        this.star_5_empty = true;

      }

      if(rate > 1 && rate < 2) { 
        stars = 1.5;
        this.star_1_half = false;
        
        this.star_2_half = true;
        this.star_3_half = false;
        this.star_4_half = false;
        this.star_5_half = false;
        
        this.star_1_full = true;
        this.star_2_full = false;
        this.star_3_full = false;
        this.star_4_full = false;
        this.star_5_full = false;

        this.star_1_empty = false;
        this.star_2_empty = false;
        this.star_3_empty = true;
        this.star_4_empty = true;
        this.star_5_empty = true;
      }
      if(rate > 2 && rate < 3) {
         stars = 2.5
         this.star_1_half = false;
        
         this.star_2_half = false;
         this.star_3_half = true;
         this.star_4_half = false;
         this.star_5_half = false;
         
         this.star_1_full = true;
        this.star_2_full = true;
        this.star_3_full = false;
        this.star_4_full = false;
        this.star_5_full = false;

        this.star_1_empty = false;
        this.star_2_empty = false;
        this.star_3_empty = false;
        this.star_4_empty = true;
        this.star_5_empty = true;
        }
      if(rate >  3 && rate < 4) { 
        stars = 3.5
        this.star_1_half = false;
        
        this.star_2_half = false;
        this.star_3_half = false;
        this.star_4_half = true;
        this.star_5_half = false;
        
        this.star_1_full = true;
        this.star_2_full = true;
        this.star_3_full = true;
        this.star_4_full = false;
        this.star_5_full = false;

        this.star_1_empty = false;
        this.star_2_empty = false;
        this.star_3_empty = false;
        this.star_4_empty = false;
        this.star_5_empty = true;
      }
      if(rate >  4 && rate < 5) {
         stars = 4.5
        
         this.star_1_half = false;
        
        this.star_2_half = false;
        this.star_3_half = false;
        this.star_4_half = false;
        this.star_5_half = true;
        
        this.star_1_full = true;
        this.star_2_full = true;
        this.star_3_full = true;
        this.star_4_full = true;
        this.star_5_full = false;

        this.star_1_empty = false;
        this.star_2_empty = false;
        this.star_3_empty = false;
        this.star_4_empty = false;
        this.star_5_empty = false;
        }

      return stars;
    }

    


  addUser(userId: string){
    let obs = this.chatService.findUser(userId)
    
    forkJoin(obs).subscribe(res => {
      console.log('res:',res)
      for( let data of res){
        if(data.length > 0){
           console.log('this is the data:  ',data)
           let _user = {
             email:data[0].data['email'],
             id: data[0].id,
             nickname: data[0].data['nickname']
           }
          this.users.push(_user)
          console.log('users: ',this.users)
        }
      }
    })
  }
  

  isSessionExit(property: Property){
    if(this.authService.currentUserId === property.userId){
      // this.router.navigateByUrl(`chat/${property.id}`)
      this.modalCtrl.create({component: ChatPage, componentProps: {userId: property.userId, theProperty: property}, id:'chat'})
      .then(modalEl => { 
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      return null;
    }else{
    // console.log('Property userId is:  ',userId)
    let groupId:string;
    let usr1, usr2: boolean;
    let thisProperty: boolean;
   return this.groupsService.groups.pipe(map(groups => {
      // console.log('These are the groups',groups)
      let grps = groups;
      let flag = 0;
      grps.forEach(group => {
        flag ++;
        // console.log('This is the group\'s users', group.users)
        usr1 = false;
        usr2 = false;
        group.users.forEach(usr => {
        
          if(usr.id === this.authService.currentUserId){
            usr1 = true;
          }
          if(usr.id === property.userId){
             usr2 = true;
          }
          //   let usr1 = group.users.find(usr => usr.id === this.authService.currentUserId);
          //  let usr2 = group.users.find(usr => usr.id === userId);
        })
        if( usr1 && usr2 ){ 
                  if(group.propertyId === property.id){
                   
                    console.log('usr1  ',usr1, 'usr2  ', usr2, ' thisProperty ', thisProperty)
                    
                    console.log('I have found the group......',group.id);
                    groupId = group.id;
                    console.log('Senddddddinnnnnnnnnnnnnng', groupId)
                    // this.onChat(groupId);
                    // this.onChat(groupId)
                  }
          }
        })
        if(groupId){
          return  groupId;

        }
      }))
    }
    // return from(null)
  }

  
  
  onChat(property: Property) {
     this.isSessionExit(this.theProperty).pipe(take(1), map(groupId =>{
      console.log('This is gId ', groupId)
      return groupId
    })).subscribe(groupId => {
      console.log('Starting modal : ', groupId)
      if(groupId !== undefined){
        this.modalCtrl.create({component: ChatDetailPage, componentProps: {groupId: groupId}, id:'chat'})
        .then(modalEl => { 
          modalEl.present();
          return modalEl.onDidDismiss();
        })
        return;
      }else{
        let groupId: string;
        let nickname: string;
        console.log('This is current User ID:  ', this.authService.currentUserId)
        console.log('This is property User ID:  ', this.theProperty.userId)
    
        console.log('What a PROPERTY', this.theProperty)
      return this.afs.collection<User[]>(`users`).snapshotChanges()
          // this.afs.collection('users').valueChanges({ idField: 'id' })
          .pipe(
          // take(1),
          map(changes => changes.map(({ payload: { doc } }) => {
            const data = doc.data();
            const id = doc.id
            return { id, ...data };
          })),
          map((users) => users.find(doc => doc.id === this.theProperty.userId && doc.id !== this.authService.currentUserId))
             
            ).subscribe(usr => {
              if(usr){
                console.log('I am here:   ', usr)
    
                this.users.push(usr)
                let current = {
                  email: this.auth.currentUser.email,
                  id: this.auth.currentUserId,
                  nickname: this.auth.nickname
                };
                this.users.push(current)
                if(this.users){
                  console.log('I am the users',this.users)
                  
                  this.createGroup(this.theProperty.description, this.users).then((gId)=> {
                          groupId = gId;
                          console.log('This is the owner groupId', groupId)
                          
                          // this.router.navigateByUrl(`chat/chat-detail/${groupId}`)
                           this.modalCtrl.create({component: ChatDetailPage, componentProps: { groupId: groupId}, id:'chat'})
          .then(modalEl => { 
            modalEl.present();
            return modalEl.onDidDismiss();
          })
                        });
                }
              }
            })
      }
    });

    
  // *******************************************************
  //****************************************************** */
      //   ))
      // .subscribe(users => {
      //   let theUsers = users;
      //     let user = theUsers.find(usr => {usr.id === property.userId} )
      //     console.log('The User is:  ', user)
      //     if(!user){
      //       console.log('Can not find user',theUsers)
      //       return
      //     }
      //     this.users.push(user)
          
      //     console.log('Current users are :  ', this.users)
      //     this.createGroup((new Date()).toString, this.users).then((gId)=> {
      //       groupId = gId;
      //       console.log('This is the owner groupId', groupId)
      //     });
      //   })
       
      

      // this.addUser(this.authService.currentUserId)
      // console.log('This is the nickname....', nickname)
    //   this.addUser(nickname)
    // this.router.navigateByUrl(`properties/tabs/chat/chat-detail/${groupId}`)
  }

  createGroup(title, users) {
    console.log('The USERS......', users)
    // let current = {
    //   email: this.auth.currentUser.email,
    //   id: this.auth.currentUserId,
    //   nickname: this.auth.nickname
    // };

    // if(users.length = 0){
    //   return;
    // }
 
    // let allUsers = [current, ...users];
    // console.log('The All Users....', allUsers)
    return this.afs.collection('groups').add({
      title: title,
      users: users,
      propertyId: this.theProperty.id,
    }).then(res => {
      console.log('This is working', res)
      let promises = [];
 
      for (let usr of users) {
        console.log('Adding groups: ', res.id , '   collection to every user: ', usr)
        let oneAdd = this.afs.collection(`users/${usr['id']}/groups`).add({
          id: res.id
        });
        
      }
      return res.id;
    })
  }

  onList(property: Property) {
    if(this.theProperty.id){

      this.router.navigateByUrl(`properties/tabs/browser/chat/${this.theProperty.id}`)
    }
    
      // this.modalCtrl.create({component: ChatPage, componentProps: {userId: this.authService.user.uid, theProperty: property}, id:'chat'})
      // .then(modalEl => { 
      //   modalEl.present();
      //   return modalEl.onDidDismiss();
      // })

    
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
