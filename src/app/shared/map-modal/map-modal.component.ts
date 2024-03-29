import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { resolve } from 'url';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  clickListener: any;
  googleMaps: any;
@ViewChild('map') mapElementRef: ElementRef;
@Input() center =  {lat:21.604648 , lng: 39.156819}
@Input() selectable = true;
@Input() closeButtonText = 'Cancel';
@Input() title = 'حدد موقعا';

  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2
    ) { }

  ngOnInit() {}
 
  ngAfterViewInit() {
    this.getGoogleMaps().then(googleMaps => {
      this.googleMaps = googleMaps;
      const mapEl = this.mapElementRef.nativeElement; 
    const map =  new googleMaps.Map(mapEl, {
        center: this.center,
        zoom: 16
      });

      this.googleMaps.event.addListenerOnce(map, 'idle', () => {
      this.renderer.addClass(mapEl, 'visible');
      });
    
      if(this.selectable) {

        this.clickListener = map.addListener('click', event => {
           const selectedCoords = {
             lat: event.latLng.lat(),
             lng: event.latLng.lng()
             };
             this.modalCtrl.dismiss(selectedCoords);
            });
      }else {
        const marker = new googleMaps.Marker({
          position: this.center,
          map: map,
          title: 'الموقع'
        });
        marker.setMap(map);
      }
    }).catch(err =>{
      console.log(err);
    })
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' + environment.googleMapsAPIKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available.');
        }
      };
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy() {
    if(this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }
}
