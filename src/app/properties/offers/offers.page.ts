import { LikesService } from './../../shared/likes.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { OffersService } from './offers.service';
import { Offer } from './offer.model';
import { Subscription } from 'rxjs';
 
import { PropertiesService } from '../properties.service';
import {
  MenuController,
  ModalController,
  LoadingController,
  IonItemSliding,
  IonInfiniteScroll,
  IonVirtualScroll,
  ActionSheetController
} from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { SegmentChangeEventDetail } from '@ionic/core';
import { LanguagesService, Labels } from 'src/app/languages.service';
import { NewOfferPage } from './new-offer/new-offer.page';
import { take, tap } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';

import { Property, Like } from '../property.model';
import { NavController } from '@ionic/angular';
import { EditPage } from './edit/edit.page';
import { CreateBookingComponent } from '../search/bookings/create-booking/create-booking.component';
import { BookingService } from 'src/app/bookings/booking.service';
import { Booking } from '../search/create-booking/booking.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit, OnDestroy {
  myProperties: Property[] = [];
  myOffers: Offer[];
  myOfferedProperties: Property[] = [];
  listedProperties: Property[] = [];
  listedOffers: Offer[];
  offersSub: Subscription;
  porpsSub: Subscription;
  updateSub: Subscription;
  filter = 'properties';
  labels: Labels;
  offerProperties: Property[] = [];
  tempProperties: Property[] = [];
  public isToggled: boolean;
  currentProperty: Property;
  nothingToDisplay = false;
  lastVisitedOffer: Property;
  lastVisitedProperty: Property;

  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll, { static: true })
  virtualScroll: IonVirtualScroll;
  messages: boolean = false;
  listOfProperties: boolean = true;
  messageActive: boolean = false;
  mapActive: boolean = false;
  map: boolean = false;
  listActive : boolean = false;
  imageActive: boolean = false;
  image: boolean = false;
  likeOn: boolean = false;
  isLoading = false;
  bookmarkOn: boolean = false;
  bokngs : Booking[] = [];
  likesService: LikesService
  likes: Like[] = []

  constructor(
    private offersService: OffersService,
    private propertiesService: PropertiesService,
    private menuCtl: MenuController,
    private router: Router,
    private modalCtrl: ModalController,
    private loadCtrl: LoadingController,
    private authService: AuthService,
    private languageService: LanguagesService,
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private auth: AuthService,
    private bookingService: BookingService
  ) {
    this.isToggled = false;
    // this.doInfinite(event);
  }

  ngOnInit() {
    this.languageService.arabicLabel.subscribe(labels => {
      this.labels = labels;
    });
    this.isLoading = true;


        this.porpsSub = this.propertiesService.properties.subscribe((properties: Property[]) => {
         console.log(properties)
         
         this.listedProperties = properties.filter(
           prop => prop.userId === this.authService.currentUserId  
           );
           this.currentProperty = this.listedProperties[0];
           
           this.myOfferedProperties = properties.filter(
             prop => prop.userId === this.authService.currentUserId && prop.display 
             );
             this.isLoading = false;
        });
    
        this.setcurrentProperty();
        this.onList();
    
        if (this.currentProperty) {
          this.checkLike();
          this.checkBookmark();
          this.onList();
        }
      
  }
 
  ionViewWillEnter() {
    this.propertiesService.getProperties().subscribe(()=> {
      if (this.currentProperty) {
        this.checkLike();
        this.checkBookmark();
        this.onList();
      }
    })
    this.setcurrentProperty();
  }

  ionViewWillLeave() {
   if (this.filter === 'offers') {
     this.lastVisitedOffer = this.currentProperty;
   } else {
     this.lastVisitedProperty = this.currentProperty;
   }
   this.propertiesService.getProperties().subscribe()
   this.setcurrentProperty();
  }

 ionViewWillChange(){
   this.setcurrentProperty()
  } 


  onBookMark() {
    if(!this.bokngs){
      this.currentProperty.reservations = [];
    }

   

        if (!this.currentProperty.reservations.find(resv => resv.customerId = this.authService.currentUserId)) {
          console.log(this.currentProperty.reservations.find(resv => resv.customerId = this.authService.currentUserId))
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
              this.currentProperty.reservations.push({
                customerId: this.authService.currentUserId,
                onDate: new Date(),
              });
              this.propertiesService
                .updateProperty(this.currentProperty)
                .subscribe(() => {
                  // this.bookmarkOn = true;
                  this.router.navigateByUrl(`/properties/tabs/discover`);
                });
            });
        } else {
          console.log(this.currentProperty.reservations.find(resv => resv.customerId = this.authService.currentUserId))
          this.actionSheetCtrl
            .create({
              header: this.labels.cancelBookingQuest,
              buttons: [
                {
                  text: this.labels.ok,
                  handler: () => {
                    // this.bookmarkOn = false;
                    this.currentProperty.reservations.forEach((resv, index) => {
                      //  if( resv.customerId === this.authService.userId) {
                      this.currentProperty.reservations.splice(index, 1);
                      this.propertiesService
                        .updateProperty(this.currentProperty)
                        .subscribe(() => {
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

  checkLike() {
    if (this.currentProperty.likes) {

            if (
              this.currentProperty.likes.find(
                (like) => like.guestId === this.authService.currentUserId
              )
            ) {
              this.likeOn = true;
            } else {
              this.likeOn = false;
            }

          
    }
  }

  editProperty(property: Property) {
    this.modalCtrl
      .create({
        component: EditPage,
        componentProps: { property: property },
        id: "EditProperty",
      })
      .then((modlEl) => {
        modlEl.present();
      });
  }


  setcurrentProperty() {
    
    if (this.filter === 'properties') {
      this.listedProperties = this.myProperties;
      if(this.lastVisitedProperty && this.listedProperties.find(property => property.id === this.lastVisitedProperty.id)) {
        this.currentProperty = this.lastVisitedProperty;
        console.log(this.lastVisitedProperty.id)
      }    
      else if (!this.currentProperty || !this.listedProperties.find(property => property.id === this.currentProperty.id)) {
        this.currentProperty = this.listedProperties[0];
      } 
    }
    if (this.filter === 'offers') {
      this.listedProperties = this.myOfferedProperties;
      if(this.lastVisitedOffer && this.listedProperties.find(property => property.id === this.lastVisitedOffer.id)){
        this.currentProperty = this.lastVisitedOffer;
      } else  if (!this.currentProperty || !this.listedProperties.find(property => property.id === this.currentProperty.id)) {
        
        this.currentProperty = this.listedProperties[0];
      }
    }
    if(!this.currentProperty){
      this.currentProperty= null;
    }
    this.checkListedProperties();

  }

  addProperty() {
    this.navCtrl.navigateForward("/properties/tabs/offers/new")
  }

  

  checkListedProperties() {
    if (!this.listedProperties) {
      this.nothingToDisplay = true;
    }
  }

  clickedPrperty(id: string) {
    this.propertiesService
      .getProperty(id)
      .subscribe(prop => (this.currentProperty = 
        {
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
        ));
  }

  public notify(property: Property) {
    console.log(property.id + ' ' + property.display);
    this.updateSub = this.propertiesService
      .updateProperty(property)
      .subscribe(props => {
        this.setcurrentProperty();
      });
  }

async  onFilterUpdate(filter: string) {
    this.propertiesService.properties.subscribe()
    if(this.currentProperty)
    if (filter === 'offers') {
      this.filter = 'offers';
      
      this.lastVisitedProperty = this.currentProperty;
     
      console.log(this.lastVisitedProperty.id )
    } else {
      this.filter = 'properties';
      this.lastVisitedOffer = this.currentProperty;
      
    }

   await  this.setcurrentProperty();
  }

  onLike(id: string, event: Event) {
   



        if (!this.likeOn) {
          this.likeOn = true;
    
          if (
            !this.currentProperty.likes.find(
              like => like.guestId === this.authService.currentUserId
            )
          ) {
            this.currentProperty.likes.push(
              {id: '',
              time: new Date(),
              propertyId: '',
              guestId:this.authService.currentUserId, date: new Date()}
            );
            console.log("Like is been added");
          }
          console.log(this.likes[0].date);
        } else {
          this.likeOn = false;
          this.likes.forEach((like, index) => {
            if (like.guestId === this.authService.currentUserId) {
              this.currentProperty.likes.splice(index, 1);
            }
          });
        }
        const oldCurrentProperty = this.currentProperty;
        const oldLikeOn = this.likeOn;
        this.updateSub = this.propertiesService
          .updateProperty(this.currentProperty)
          .subscribe(() => {
            this.currentProperty = oldCurrentProperty;
            this.likeOn = oldLikeOn;
          });
      
  }

  checkBookmark() {
    console.log(this.currentProperty.id);
    this.bookingService.bookings.subscribe(bookings => {

            const books = bookings.filter(booking => {
               (booking.propertyId === this.currentProperty.id && booking.guestId === this.authService.currentUserId)
             } )
               
               if(books){
                 this.bookmarkOn = true;
             }
               else {
                this.bookmarkOn = false;
              }
          })
      
    
    
  }

  onList() {
    this.listOfProperties = true;
    this.listActive = true;
    this.messageActive = false;
    this.messages = false;
    this.mapActive = false;
    this.map = false;
    this.imageActive = false;
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



  onEditProperty(propertyId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'discover', propertyId]);
    console.log('Editing item', propertyId);
  }

  onOfferProperty(propertyId: string, slidingItem: IonItemSliding) {
    slidingItem.close();

    this.modalCtrl
      .create({
        component: NewOfferPage,
        componentProps: { propertyId },
        id: 'newOffer'
      })
      .then(modalEl => {
        modalEl.present();
      });
  }

  doInfinite(event) {
    setTimeout(() => {
      if (this.filter === 'properties') {
        this.listedProperties = this.myProperties;
      }
      if (this.filter === 'offers') {
        this.listedProperties = this.myOfferedProperties;
      }
      this.setcurrentProperty();
      this.virtualScroll.checkEnd();
      this.infiniteScroll.complete();
    }, 2000);
  }

  ngOnDestroy() {
    if (this.offersSub) {
      this.offersSub.unsubscribe();
    }
    if (this.porpsSub) {
      this.porpsSub.unsubscribe();
    }
    if (this.updateSub) {
      this.updateSub.unsubscribe();
    }
  }
}
