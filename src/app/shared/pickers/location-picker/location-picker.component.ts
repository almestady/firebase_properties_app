import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { ModalController, ActionSheetController, AlertController } from "@ionic/angular";
import { MapModalComponent } from "../../map-modal/map-modal.component";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { map, switchMap } from "rxjs/operators";
import { Location } from "../../../properties/location.model";
import { of } from "rxjs";
import { Capacitor, Plugins } from '@capacitor/core';


@Component({
  selector: "app-location-picker",
  templateUrl: "./location-picker.component.html",
  styleUrls: ["./location-picker.component.scss"]
})
export class LocationPickerComponent implements OnInit {
  selectedLocationImage: string;
  isLoading = false;
  @Output() locationPick = new EventEmitter<Location>();
  @Input() showPreview = false;
  
  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private actionSheetCntl: ActionSheetController,
    private alertCtrl: AlertController  
      ) {}

  ngOnInit() {}

  onPickLocation() {
    this.actionSheetCntl.create({header: 'Please Choose', buttons: [
      { text: 'Áuto-Locate', handler: () => {
       this.locateUser();
      }},
      { text: 'Pick on Map', handler: () => {
        this.openMap();
      }},
      { text: 'Cancel', role: 'cancel'}
    ]}).then(acEl => {
      acEl.present();
    });
    
  }

  private locateUser() {
     if ( !Capacitor.isPluginAvailable('Geolocation')) {
       this.showErrorAlret()
       return;
     }
     this.isLoading = true;
     Plugins.Geolocation.getCurrentPosition()
     .then(geoPosition => {
       const coordinates = {
          latitude: geoPosition.coords.latitude,
           longitude: geoPosition.coords.longitude
          };
          this.createPlace(coordinates.latitude, coordinates.longitude);
          this.isLoading = false;
     }
     ).catch(err => {
      this.isLoading = false;
        this.showErrorAlret()
     })
  }

  private showErrorAlret() {
    this.alertCtrl.create({header: 'Could not fetch location', message: 'Please use the map to pick a location!'})
    .then(alEl => {
      alEl.present();
    })
  }

  private openMap() {
    this.modalCtrl.create({ component: MapModalComponent }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }

        const coordinates = {
          latitude: modalData.data.lat,
          longitude: modalData.data.lng
        };
        this.createPlace(coordinates.latitude, coordinates.longitude)
       
      });
      modalEl.present();
    });
  }

  private createPlace(lat: number, lng: number) {
    const pickedLocation: Location = {
      lat: lat,
      lng: lng,
      address: null,
      staticmapimageurl: null,
      created_at: new Date(),
     updated_at: new Date()
    };

    this.isLoading = true;

    this.getAddress(lat, lng)
      .pipe(
        switchMap(address => {
          pickedLocation.address = address;
          return of(
            this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
          );
        })
      )
      .subscribe(staticMapImageUrl => {
        pickedLocation.staticmapimageurl = staticMapImageUrl;
        console.log(pickedLocation);
        this.selectedLocationImage = staticMapImageUrl;
        this.isLoading = false;
        this.locationPick.emit(pickedLocation);
      });
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsAPIKey}`
      )
      .pipe(
        map(geoData => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x500&maptype=roadmap
                                  &markers=color:red%7Clabel:Property%7C${lat},${lng}
                                  &key=${environment.googleMapsAPIKey}`;
  }
}
