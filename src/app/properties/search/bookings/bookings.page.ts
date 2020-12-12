import { Component, OnInit, OnDestroy, Input } from '@angular/core';


import { Subscription } from 'rxjs';
import { Labels, LanguagesService } from '../../../languages.service';
import { AuthService } from '../../../auth.service';
import { PropertiesService } from '../../properties.service';

import { Property, Reservation, Like } from '../../property.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ActionSheetController } from '@ionic/angular';
import { take, map } from 'rxjs/operators';
import { delay } from 'q';
import { BookingService } from 'src/app/bookings/booking.service';



@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
 loadedBookings: Property[];
 bookingSub: Subscription;
 labels: Labels;
 currentProperty: Property;
 bookingCancelSub: Subscription;
 messages: boolean = false;
 listOfProperties: boolean = true;
 messageActive: boolean = false;
 mapActive: boolean = false;
 map: boolean = false;
 listActive : boolean = false;
 imageActive: boolean = false;
 image: boolean = false;
 likeOn: boolean;
 updateSub: Subscription;
 bookings: Property[];
 listOfBookings: Property[] = [];
 langSub: Subscription;
 propServSub: Subscription;
 listSub: Subscription;
 bookmarkOn: boolean = false;
 offerOn: boolean = false;
 likes: Like[] = []

  constructor(
    private bookingService: BookingService,
    private languageService: LanguagesService,
    private authService: AuthService,
    private propertiesService: PropertiesService,
    private routes: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router,
    private actionSheetCtrl: ActionSheetController
    ) { }

  ngOnInit() {
    this.languageService.arabicLabel.subscribe(labels => this.labels = labels);
    // this.bookingSub = this.bookingService.bookings.subscribe(bookings => {
    //   this.loadedBookings = bookings;
    // }); 
    // this.currentProperty = this.loadedBookings[0];
    this.routes.paramMap.subscribe(paramMap => {
      if (!paramMap.has('propertyId')) {
        this.navCtrl.navigateBack('/properties/tabs/discover/bookings');
      
        this.currentProperty = null;
        return;
      } else{

        this.propertiesService.getProperty(paramMap.get('propertyId')).subscribe(prop => {
          this.currentProperty = {
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

          this.checkHasOffer();
          this.checkBookmark();
          this.checkLike();
        });
      }
    
    });     

    this.propertiesService.properties.subscribe(properties => {
        properties.filter(property => {
        property.reservations.forEach((resv, index) => {
          // this.authService.userId.pipe(take(1)).subscribe(userId => {
          //   if(!userId){
          //     throw Error('Could not find userId')
          //   }


            if ( resv.customerId === this.authService.currentUserId) {
              this.listOfBookings.push(property);
              this.currentProperty =  this.listOfBookings[0];
            }
          // })
        })
      })
    });
      
  }

  ionViewWillEnter() {
    this.checkLike();
    this.checkHasOffer();
    this.checkBookmark();
  }

  onCancelBookmark() {
    this.actionSheetCtrl.create({
      header: this.labels.cancelBookingQuest,
      buttons:[
        {
          text: this.labels.ok,
          handler: () => {
            this.currentProperty.reservations.forEach((resv, index) => {
              // this.authService.userId.pipe(take(1)).subscribe(userId => {
              //   if(!userId){
              //     throw Error('Could not find userId')
              //   }

                
                if( resv.customerId === this.authService.currentUserId) {
                      this.currentProperty.reservations.splice(index, 1);
                      this.bookmarkOn = false;
                      this.propertiesService.updateProperty(this.currentProperty).subscribe(() => {
                       
                       this.router.navigateByUrl(`/properties/tabs/discover/bookings`);
                       
                     });
                   
                }
              // })
            });
          }
      },
      {
        text: this.labels.cancel,
        role: 'cancel'
      }
      ]
    }).then (actionEl => {
      actionEl.present();
    });
  }

  checkHasOffer() {
    if(this.currentProperty && this.currentProperty.hasOffer) {
    if ( !this.currentProperty.hasOffer["active"]) {
        this.offerOn = false;
    } else {
      this.offerOn = true;
    }
  }
  }

  checkBookmark() {
    
    if(this.currentProperty) {
      // this.authService.userId.pipe(take(1)).subscribe(userId => {
      //   if(!userId){
      //     throw Error('Could not find userId')
      //   }

        if (
          this.currentProperty.reservations.find(
            resv => resv.customerId === this.authService.currentUserId
          )
        ) {
          this.bookmarkOn = true;
        } else {
          this.bookmarkOn = false;
        }
      // })
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

    checkLike() {
      if(this.currentProperty) {
        // this.authService.userId.pipe(take(1)).subscribe(userId => {
        //    if(!userId){
        //      throw Error('Could not find userId')
        //    }

          if (this.currentProperty.likes && 
            this.currentProperty.likes.find(
              like => like.guestId === this.authService.currentUserId
            )
          ) {
            this.likeOn = true;
          } else {
            this.likeOn = false;
          }
        // })
      }
    }

    onLike(id: string, event: Event) {
      
      // this.authService.userId.pipe(take(1)).subscribe(userId => {
      //   if (!this.likeOn) {
      //     this.likeOn = true;

          if (
            !this.likes.find(
              like => like.guestId = this.authService.currentUserId
            )
          ) {
            this.likes.push(
             {id: '',
             time: new Date(),
             propertyId: '',
              guestId:this.authService.currentUserId, date: new Date(),}
            );
            console.log("Like is been added");
            console.log(this.likes[0].date);
          }
        // }
         else {
          this.likeOn = false;
          this.currentProperty.likes.forEach((like, index) => {
            if (like.guestId === this.authService.currentUserId) {
              this.currentProperty.likes.splice(index, 1);
            }
          });
        }
        const oldcurrentProperty = this.currentProperty;
        const oldLikeOn = this.likeOn;
        this.updateSub = this.propertiesService
          .updateProperty(this.currentProperty)
          .subscribe(() => {
            this.currentProperty = oldcurrentProperty;
            this.likeOn = oldLikeOn;
          });
        // })
    }

    clickedPrperty(id: string) {
      this.propertiesService.getProperty(id).subscribe(prop => {
        this.currentProperty =  {
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
        this.checkLike();
        this.checkBookmark();
      });
    }
  

  clickedBooking(id: string) {
    // this.bookingService.getBooking(id).subscribe(booking => this.currentProperty = booking);
    
  }  

  // cancelBooking(bookingId: string) {
  //   this.bookingCancelSub = this.bookingService.cancelBooking(bookingId).subscribe(bookings => {});
  // }

  ngOnDestroy() {
    if (this.bookingSub) {
      this.bookingSub.unsubscribe();
    }
    if (this.langSub) {
      this.langSub.unsubscribe;
  }
  if (this.propServSub) {
    this.propServSub.unsubscribe;
  }
}
}
